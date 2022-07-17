const {
  sel,
  expr,
  box: _flat_box,
  untrack: _flat_untrack,
  batch: _flat_batch
} = require('reactive-box');
const {
  attach
} = require('unsubscriber');

const key_remini = '.remini';
const key_fn = 'fn';


//
// Common
//

const _safe_call = (fn, m, ctx, args) => {
  const f = m();
  try { return fn.apply(ctx, args) }
  finally { f() }
}
const _safe_scope_fn = (m) => (
  (fn) => function () {
    return _safe_call(fn, m, this, arguments);
  }
);
const _safe_scope = (m) => (
  (fn) => _safe_call(fn, m)
);

const batch = _safe_scope(_flat_batch);
batch[key_fn] = _safe_scope_fn(_flat_batch);

const untrack = _safe_scope(_flat_untrack);
const untrack_fn = untrack[key_fn] = _safe_scope_fn(_flat_untrack);


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
  attach(e[1]);
  v = e[0]();
  if (ev_fn) v = void 0;
  if (m === 2) fn(v);
  return e[1];
});

const on = _sub_fn();
const once = _sub_fn(1);
const sync = _sub_fn(2);


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
      obj_def_box_prop(this, key, _target && _target.bind(this));
      return this[key];
    },
    set(value) {
      obj_def_box_prop(this, key, _target && _target.bind(this));
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
// Exports
//

module.exports = {
  box, wrap, read, write, update, readonly,
  on, once, sync,
  event, fire, filter, map,
  batch, untrack,
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
