const
  { sel, expr, box: _re_box, untrack: _re_untrack, batch: _re_batch } = require('reactive-box'),
  { attach } = require('unsubscriber'),


  key_remini = '.re',
  key_fn = 'fn',


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
  batch_fn = batch[key_fn] = _safe_scope_fn(_re_batch),

  untrack = _safe_scope(_re_untrack),
  untrack_fn = untrack[key_fn] = _safe_scope_fn(_re_untrack),

//
// Entity
//

  _ent = (h) => {
    const ent = {};
    ent[key_remini] = h;
    return ent;
  },

  box = (v) => _ent(_re_box(v)),
  wrap = (r, w) => _ent([
    (r[key_remini] ? r[key_remini][0] : sel(r)[0]),
    (w && untrack_fn((v) => w[key_remini] ? w[key_remini][1](v) : w(v)))
  ]),

  read = (r) => r[key_remini][0](),

  write = (r, v) => r[key_remini][1](v),
  update = untrack_fn((r, fn) => write(r, fn(read(r)))),

  map = (r, v) => _ent([sel(() => v(read(r)))[0]]),
  readonly = (r) => _ent([r[key_remini][0]]),


//
// Subscription
//

  _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
    let v;
    r = r[key_remini] ? r[key_remini][0] : sel(r)[0];
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
  batch, untrack,
  key_remini
};


//
// Enjoy and Happy Coding!
//
