import { un, unsubscriber, run, collect } from 'unsubscriber'
import { sel, expr, box, untrack as _re_untrack, batch as _re_batch } from 'reactive-box'
import { event, listen } from 'evemin'


const

//
// Common
//

  _safe_call = (fn, ctx, args, m) => {
    const f = m();
    try { return fn.apply(ctx, args) }
    finally { f() }
  },
  _safe_scope_fn = (m) => (
    (fn) => function () {
      return _safe_call(fn, this, arguments, m);
    }
  ),
  _safe_scope = (m) => (
    function () {
      return _safe_call(arguments[0], this, Array.prototype.slice.call(arguments, 1), m);
    }
  ),

  batch = _safe_scope(_re_batch),
  batch_fn = batch.fn = _safe_scope_fn(_re_batch),

  untrack = _safe_scope(_re_untrack),
  untrack_fn = untrack.fn = _safe_scope_fn(_re_untrack),


//
// Entity
//

  wrap = (r, w) => [(r[0] ? r[0] : sel(r)[0])]
    // if not w, should be array with one element
    .concat(!w ? [] : untrack_fn((v) => w[1] ? w[1](v) : w(v))),

  getter = (r) => r[0],
  get = (r) => r[0](),
  setter = (r) => r[1],
  set = (r, v) => r[1](v),
  update = untrack_fn((r, fn) => set(r, fn(get(r)))),

  readonly = (r) => [r[0]],


//
// Subscription
//

  _sub_fn = (m /* 1 once, 2 sync */) => (r, fn) => {
    let v, off;
    if (typeof r === 'function' && r[0]) {
      off = listen(r, (d) => {
        const prev = v;
        fn(v = d, prev);
        m === 1 && off();
      });
      un(off);

    } else {
      r = r[0] ? r[0] : sel(r)[0];
      const e = expr(r, () => {
        const prev = v;
        fn(v = m === 1
          ? r()
          : e[0](),
          prev
        );
      });
      un(off = e[1]);
      v = e[0]();
      if (m === 2) untrack(() => fn(v));
    }

    return off;
  },

  on = _sub_fn(),
  once = _sub_fn(1),
  sync = _sub_fn(2),


//
// Waiting
//

  _promise_fn = (m /* 1 truthy, 2 falsy, 3 next */) => (r) => new Promise(ok => {
    const
      u = unsubscriber(),
      stop = () => run(u);
    un(stop);
    collect(u, () => (m === 3 ? once : sync)(r, (v) => (
      ((m === 1 && v)
      || (m === 2 && !v)
      || m === 3)
      && (stop(), ok(v))
    )));
  }),

  promiseTruthy = _promise_fn(1),
  promiseFalsy = _promise_fn(2),
  promiseNext = _promise_fn(3),

  waitTruthy = promiseTruthy,
  waitFalsy = promiseFalsy,
  waitNext = promiseNext,


//
// Deprecated, will remove in 2.0.0
//

  put = set,
  write = set,
  val = get,
  read = get,
  select = (r, f) => [sel(() => f(get(r)))[0]]


//
// Box classes
//

class BoxFaceClass {
  constructor(getter) {
    this[0] = getter
  }
}

class BoxFaceWritableClass extends BoxFaceClass {
  constructor(getter, setter) {
    super(getter)
    this[1] = setter
  }
}

class BoxClass extends BoxFaceWritableClass {
  constructor(value) {
    const b = box(value);
    super(b[0], b[1])
  }
};

//
// Exports
//

export {
  box,
  getter, get, setter, set, update,
  wrap,
  on, once, sync,
  readonly,
  batch, untrack,
  event,
  promiseTruthy, promiseFalsy, promiseNext,
  waitTruthy, waitFalsy, waitNext,
  un,

  BoxFaceWritableClass,
  BoxFaceClass,
  BoxClass,

  // deprecated, will remove in 2.0.0
  val, put, read, write, select
};


//
// Enjoy and Happy Coding!
//
