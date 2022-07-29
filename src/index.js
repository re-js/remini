const
  { sel, expr, box, untrack: _re_untrack, batch: _re_batch } = require('reactive-box'),
  { attach } = require('unsubscriber'),


//
// Common
//

  _safe_call = (fn, m, ctx, args) => {
    const f = m();
    try { return fn.apply(ctx, args) }
    finally { f() }
  },
  _safe_scope_fn = (m) => (
    (fn) => function () {
      return _safe_call(fn, m, this, arguments);
    }
  ),
  _safe_scope = (m) => (
    (fn) => _safe_call(fn, m)
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

  read = (r) => r[0](),

  write = (r, v) => r[1](v),
  update = untrack_fn((r, fn) => write(r, fn(read(r)))),

  map = (r, v) => [sel(() => v(read(r)))[0]],
  readonly = (r) => [r[0]],


//
// Subscription
//

  _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
    let v;
    r = r[0] ? r[0] : sel(r)[0];
    const e = expr(r, () => {
      const prev = v;
      v = m === 1
        ? r()
        : (v = e[0](), v);
      fn(v, prev);
    });
    attach(e[1]);
    v = e[0]();
    if (m === 2) fn(v);
    return e[1];
  }),

  on = _sub_fn(),
  once = _sub_fn(1),
  sync = _sub_fn(2)


//
// Exports
//

module.exports = {
  box, wrap, read, write, update, readonly,
  on, once, sync,
  map,
  batch, untrack
};


//
// Enjoy and Happy Coding!
//
