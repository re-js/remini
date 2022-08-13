const
  { sel, expr, box, untrack: _re_untrack, batch: _re_batch } = require('reactive-box'),
  { attach } = require('unsubscriber'),
  { event, listen } = require('evemin'),


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

  select = (r, v) => [sel(() => v(read(r)))[0]],
  readonly = (r) => [r[0]],


//
// Subscription
//

  _sub_fn = (sync) => (r, fn) => {
    let v, off;
    if (typeof r === 'function' && r[0]) {
      off = listen(r, (d) => {
        const prev = v;
        fn(v = d, prev);
      });
      attach(off);

    } else {
      r = r[0] ? r[0] : sel(r)[0];
      const e = expr(r, () => {
        const prev = v;
        fn(v = e[0](), prev);
      });
      attach(off = e[1]);
      v = e[0]();
      if (sync) untrack(() => fn(v));
    }

    return off;
  },

  on = _sub_fn(),
  sync = _sub_fn(1)


//
// Exports
//

module.exports = {
  box,
  read, write, update,
  select,
  wrap,
  on, sync,
  readonly,
  batch, untrack,
  event,
  un: attach
};


//
// Enjoy and Happy Coding!
//
