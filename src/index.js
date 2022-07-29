const {
  sel,
  expr,
  box: _re_box,
  untrack: _re_untrack,
  batch: _re_batch
} = require('reactive-box');
const {
  attach
} = require('unsubscriber');

const key_remini = '.re';
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

const batch = _safe_scope(_re_batch);
batch[key_fn] = _safe_scope_fn(_re_batch);

const untrack = _safe_scope(_re_untrack);
const untrack_fn = untrack[key_fn] = _safe_scope_fn(_re_untrack);


//
// Entity
//

const _ent = (h) => {
  const ent = {};
  ent[key_remini] = h;
  return ent;
};

const box = (v) => _ent(_re_box(v));
const wrap = (r, w) => _ent([
  (r[key_remini] ? r[key_remini][0] : sel(r)[0]),
  (w && untrack_fn((v) => w[key_remini] ? w[key_remini][1](v) : w(v)))
]);

const read = (r) => r[key_remini][0]();

const write = (r, v) => r[key_remini][1](v);
const update = untrack_fn((r, fn) => write(r, fn(read(r))));

const map = (r, v) => _ent([sel(() => v(read(r)))[0]]);
const readonly = (r) => _ent([r[key_remini][0]]);


//
// Subscription
//

const _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
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
});

const on = _sub_fn();
const once = _sub_fn(1);
const sync = _sub_fn(2);


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
