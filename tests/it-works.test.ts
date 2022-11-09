import {
  box, wrap, val, put, update, readonly,
  on, once, sync,
  batch, untrack
} from 'remini';

describe('should works', () => {

  test('re, val, put', () => {
    const a = box(0);
    put(a, 10);
    expect(val(a)).toBe(10);
  });

  test('update', () => {
    const a = box(0);
    update(a, (v) => v + 3);
    expect(val(a)).toBe(3);
  });

  test('wrap', () => {
    const a = box(1);
    const b = box(2);

    const k = wrap(a);
    const p = wrap(() => val(a) + val(a));
    const n = wrap(a, (v) => put(a, v + 1));
    const m = wrap(() => val(a) + 2, (n) => update(b, (v) => v + n));
    const q = wrap(b, b);

    expect(val(k)).toBe(1);
    expect(val(p)).toBe(2);
    expect(val(n)).toBe(1);
    expect(val(m)).toBe(3);

    put(n, 10);
    expect(val(k)).toBe(11);
    expect(val(p)).toBe(22);
    expect(val(n)).toBe(11);
    expect(val(m)).toBe(13);

    put(m, 10);
    expect(val(b)).toBe(12);

    update(q, (v) => v + 10);
    expect(val(q)).toBe(22);
  });

  test('readonly', () => {
    const a = box(1);
    const k = readonly(a);

    expect(val(k)).toBe(1);
    update(a, (v) => v + 1);
    expect(val(k)).toBe(2);

    expect(() => put(k as any, 10)).toThrow();
    expect(() => update(k as any, (v: number) => v + 1)).toThrow();
  });

  test('on', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    on(() => val(a) + val(b), (v) => x(v));
    on(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    put(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    put(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('sync', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    sync(() => val(a) + val(b), (v) => x(v));
    sync(a, (v) => y(v));

    expect(x).toBeCalledWith(3); x.mockReset();
    expect(y).toBeCalledWith(1); y.mockReset();

    put(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    put(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('once', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);

    once(() => val(a), (v) => x(v));
    once(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    put(a, 3);
    expect(x).toBeCalledWith(3);
    expect(y).toBeCalledWith(3);

    update(a, (v) => v + 1);
    expect(val(a)).toBe(4);
    expect(x).toBeCalledTimes(1);
    expect(y).toBeCalledTimes(1);
  });

  test('batch', () => {
    const spy = jest.fn();
    const x = box(0);
    const y = box(0);

    on(() => val(x) + val(y), (v) => spy(v));

    put(x, 1);
    put(y, 1);
    expect(spy).toBeCalledTimes(2); spy.mockReset();

    batch(() => {
      put(x, 2);
      put(y, 2);
    });
    expect(spy).toBeCalledTimes(1); spy.mockReset();

    const fn = batch.fn((k: number) => {
      put(x, k);
      put(y, k);
    });
    fn(5);
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    fn(0);
    expect(spy).toBeCalledTimes(1); spy.mockReset();

    batch(spy, 10, 11, 12);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(10, 11, 12);
    spy.mockReset();
  });

  test('untrack', () => {
    const spy = jest.fn();
    const a = box(0);
    const b = box(0);
    const c = box(0);

    const a_fn = () => val(a);
    const b_fn = () => untrack(() => val(b));
    const c_fn = untrack.fn(() => val(c));

    sync(() => {
      a_fn();
      b_fn();
      c_fn();
      return {};
    }, spy);

    spy.mockReset();
    put(a, 1);
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    put(b, 1);
    put(c, 1);
    expect(spy).toBeCalledTimes(0);

    untrack(spy, 10, 11, 12);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(10, 11, 12);
    spy.mockReset();
  });
});

