const {
  sel,
  expr,
  box: _flat_box,
  untrack: _flat_untrack,
  batch: _flat_batch
} = require('reactive-box');


let useReducer, useEffect, useRef, useMemo, memo;

/* istanbul ignore next */
try {
  // React optional require.
  const React = require('react');

  useReducer = React.useReducer;
  useEffect = React.useEffect;
  useRef = React.useRef;
  useMemo = React.useMemo;
  memo = React.memo;
}
/* istanbul ignore next */
catch {
  try {
    // Preact optional require.
    const Preact = require('preact/hooks');

    useReducer = Preact.useReducer;
    useEffect = Preact.useEffect;
    useRef = Preact.useRef;
    useMemo = Preact.useMemo;
    memo = fn => fn; // Preact hasn't memo
  }
  catch {}
}


const key_remini = '.remini';
const key_fn = 'fn';
const key_unsafe = 'unsafe';
const key_untrack = 'untrack';
const key_function = 'function';
const key_nomemo = 'nomemo';


//
// Common
//

let context_unsubs;

const _flat_unsubs = () => {
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => unsubs && unsubs.forEach(fn => fn());
  };
};

const _safe_call = (fn, m, k /* 0 - return fn(), 1 - return f() */, ctx, args) => {
  const f = m();
  try {
    const v = fn.apply(ctx, args);
    if (!k) return v;
  }
  finally {
    const v = f();
    if (k) return v;
  }
}
const _safe_scope_fn = (m, k) => (
  (fn) => function () {
    return _safe_call(fn, m, k, this, arguments);
  }
);
const _safe_scope = (m, k) => (
  (fn) => _safe_call(fn, m, k)
);

const batch = _safe_scope(_flat_batch);
batch[key_fn] = _safe_scope_fn(_flat_batch);
batch[key_unsafe] = _flat_batch;

const untrack = _safe_scope(_flat_untrack);
const untrack_fn = untrack[key_fn] = _safe_scope_fn(_flat_untrack);
untrack[key_unsafe] = _flat_untrack;

const unsubs = _safe_scope(_flat_unsubs, 1);
unsubs[key_fn] = _safe_scope_fn(_flat_unsubs, 1);
unsubs[key_unsafe] = _flat_unsubs;


const un = (unsub) => (
  unsub && context_unsubs && context_unsubs.push(unsub)
);


//
// Entity
//

const _ent = (h) => {
  const ent = {};
  ent[key_remini] = h;
  return ent;
};

const box = (v) => _ent(_flat_box(v));
const wrap = (r, w) => _ent([
  (r[key_remini] ? r[key_remini][0] : sel(r)[0]),
  (w && untrack_fn((v) => w[key_remini] ? w[key_remini][1](v) : w(v)))
]);

const read = (r) => r[key_remini][0]();
read[key_untrack] = untrack_fn(read);

const write = (r, v) => r[key_remini][1](v);
const update = untrack_fn((r, fn) => write(r, fn(read(r))));

const box_map = (r, v) => _ent([sel(() => v(read(r)))[0]]);
const readonly = (r) => _ent([r[key_remini][0]]);


//
// Subscription
//

const _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
  let v;
  const ev_fn = r[key_remini] && r[key_remini][2];
  r = r[key_remini] ? r[key_remini][0] : sel(r)[0];
  const e = expr(r, () => {
    const prev = v;
    v = m === 1
      ? (ev_fn ? ev_fn() : r())
      : (v = e[0](), (ev_fn ? ev_fn() : v));
    ev_fn ? fn(v) : fn(v, prev);
  });
  un(e[1]);
  v = e[0]();
  if (ev_fn) v = void 0;
  if (m === 2) fn(v);
  return e[1];
});

const on = _sub_fn();
const once = _sub_fn(1);
const sync = _sub_fn(2);

const cycle = (fn) => {
  const e = expr(() => fn(stop));
  const stop = e[1];
  un(stop);
  e[0]();
  return stop;
};


//
// Events
//

const event = () => {
  const h = _flat_box([]);
  return _ent([
    h[0],
    (v) => h[1]([v]),
    sel(() => h[0]()[0])[0]
  ]);
};

const fire = (r, v) => r[key_remini][1](v);

const event_map = (r, fn) => (
  _ent([
    r[key_remini][0],
    0,
    sel(() => (
      r[key_remini][0](),
      untrack(() => fn(r[key_remini][2]()))
    ))[0]
  ])
);

const filter = (r, fn) => (
  _ent([
    sel((cache) => (
      r[key_remini][0](),
      untrack(() => {
        const v = r[key_remini][2]();
        return fn(v) ? v : cache;
      })
    ))[0],
    0,
    r[key_remini][2],
  ])
);


//
// Top level
//

const map = (r, fn) => (
  r[key_remini][2]
    ? event_map(r, fn)
    : box_map(r, fn)
);


//
// Decorator functions "prop" and "cache"
//

const obj_def_prop = Object.defineProperty;
const obj_def_box_prop = (o, p, init) => (
  (init = _flat_box(init && init())),
  obj_def_prop(o, p, { get: init[0], set: init[1] })
);

const prop = (_target, key, descriptor) => (
  (_target = descriptor && descriptor.initializer), {
    get() {
      obj_def_box_prop(this, key, _target);
      return this[key];
    },
    set(value) {
      obj_def_box_prop(this, key, _target);
      this[key] = value;
    },
  }
);

const cache = (_target, key, descriptor) => ({
  get() {
    const [get] = sel(descriptor.get);
    obj_def_prop(this, key, { get });
    return this[key];
  }
});


//
// React bindings
//

let context_is_observe;
let observe_no_memo_flag;

const useForceUpdate = () => (
  useReducer(() => [], [])[1]
);

const observe = ((target) => {
  function fn() {
    const force_update = useForceUpdate();
    const ref = useRef();
    if (!ref.current) ref.current = expr(target, force_update);
    useEffect(() => ref.current[1], []);

    const stack = context_is_observe;
    context_is_observe = 1;
    try {
      return ref.current[0].apply(this, arguments);
    } finally {
      context_is_observe = stack;
    }
  }
  return observe_no_memo_flag
    ? ((observe_no_memo_flag = 0), fn)
    : memo(fn)
});

observe[key_nomemo] = (target) => (
  (observe_no_memo_flag = 1),
  observe(target)
);


const useBox = (target, deps) => {
  deps || (deps = []);
  const force_update = context_is_observe || useForceUpdate();
  const h = useMemo(() => {
    if (!target) return [target, () => {}];
    if (target[key_remini] && target[key_remini][0]) target = target[key_remini][0];

    if (typeof target === key_function) {
      if (context_is_observe) {
        return [target, 0, 1];
      } else {
        const stop = on(target, force_update);
        return [target, () => stop, 1];
      }
    } else {
      return [target, () => {}];
    }
  }, deps);

  context_is_observe || useEffect(h[1], [h]);
  return h[2] ? h[0]() : h[0];
};

const useBoxes = (targets, deps) => {
  return useBox(() => {
    let ret = Array.isArray(targets) ? [] : {};
    Object.keys(targets).forEach(key => {
      ret[key] = read(targets[key])
    });
    return ret;
  }, deps);
};

const useJsx = (fn, deps) => useMemo(() => observe(fn), deps || []);


//
// Exports
//

module.exports = {
  box, wrap, read, write, update, readonly,
  on, once, sync, cycle,
  event, fire, filter, map,
  unsubs, un,
  batch, untrack,
  observe, useBox, useBoxes, useJsx,
  prop, cache,
  key_remini
};


//
// Enjoy and Happy Coding!
//

/*

[] Add the query syntax:

const $a = box(0)
box($a, map((a) => a.user), map((u) => u.nickname))

That expression should return readonly selected store, and

const e = event();
event(e, filter((v) => v), map(v => v * 2));

The readonly event of reactive variable changing

event($a);


[] Add shallow support

box.shallow()
wrap.shallow()
on.shallow()
onсe.shallow()
sync.shallow()
useBox.shallow()


[] Add "readonly" function support for events

*/
