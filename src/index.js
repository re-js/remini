const
  { sel, expr, box, untrack: _re_untrack, batch: _re_batch } = require('reactive-box'),
  { un } = require('unsubscriber'),
  { event, listen } = require('evemin'),


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

  wrap = (r, w) => [
    (r[0] ? r[0] : sel(r)[0]),
    (w && untrack_fn((v) => w[1] ? w[1](v) : w(v)))
  ],

  val = (r) => r[0](),

  put = (r, v) => r[1](v),
  update = untrack_fn((r, fn) => put(r, fn(val(r)))),

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
  on_once = on.once = _sub_fn(1),
  sync = _sub_fn(2),


//
// Javascript integration
//

  promise = (r) => new Promise(ok => on.once(r, ok)),


//
// Deprecated, will remove in 2.0.0
//

  write = put,
  read = val,
  select = (r, f) => [sel(() => f(val(r)))[0]]


//
// Exports
//

module.exports = {
  box,
  val, put, update,
  wrap,
  on, sync,
  readonly,
  batch, untrack,
  event,
  promise,
  un,

  // deprecated, will remove in 2.0.0
  read,
  write,
  select
};


//
// Enjoy and Happy Coding!
//
