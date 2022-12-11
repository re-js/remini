import {
  box, wrap, get, set, update, readonly,
  on, once, sync,
  batch, untrack, getter
} from 'remini';

describe('should works', () => {

  test('re, get, set', () => {
    const a = box(0);
    set(a, 10);
    expect(get(a)).toBe(10);
  });

  test('getter', () => {
    const a = box(0);
    const fn = getter(a);
    expect(fn()).toBe(0);
    update(a, (v) => v + 3);
    expect(fn()).toBe(3);
  });

  test('update', () => {
    const a = box(0);
    update(a, (v) => v + 3);
    expect(get(a)).toBe(3);
  });

  test('wrap', () => {
    const a = box(1);
    const b = box(2);

    const k = wrap(a);
    const p = wrap(() => get(a) + get(a));
    const n = wrap(a, (v) => set(a, v + 1));
    const m = wrap(() => get(a) + 2, (n) => update(b, (v) => v + n));
    const q = wrap(b, b);

    expect(get(k)).toBe(1);
    expect(get(p)).toBe(2);
    expect(get(n)).toBe(1);
    expect(get(m)).toBe(3);

    set(n, 10);
    expect(get(k)).toBe(11);
    expect(get(p)).toBe(22);
    expect(get(n)).toBe(11);
    expect(get(m)).toBe(13);

    set(m, 10);
    expect(get(b)).toBe(12);

    update(q, (v) => v + 10);
    expect(get(q)).toBe(22);
  });

  test('wrap with one argument should be array with one element', () => {
    const a = box(1);

    const k = wrap(a);
    const m = wrap(a, a);

    expect(k.length).toBe(1);
    expect(m.length).toBe(2);
  });

  test('readonly', () => {
    const a = box(1);
    const k = readonly(a);

    expect(get(k)).toBe(1);
    update(a, (v) => v + 1);
    expect(get(k)).toBe(2);

    expect(() => set(k as any, 10)).toThrow();
    expect(() => update(k as any, (v: number) => v + 1)).toThrow();
  });

  test('on', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    on(() => get(a) + get(b), (v) => x(v));
    on(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    set(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    set(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('sync', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    sync(() => get(a) + get(b), (v) => x(v));
    sync(a, (v) => y(v));

    expect(x).toBeCalledWith(3); x.mockReset();
    expect(y).toBeCalledWith(1); y.mockReset();

    set(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    set(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('once', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);

    once(() => get(a), (v) => x(v));
    once(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    set(a, 3);
    expect(x).toBeCalledWith(3);
    expect(y).toBeCalledWith(3);

    update(a, (v) => v + 1);
    expect(get(a)).toBe(4);
    expect(x).toBeCalledTimes(1);
    expect(y).toBeCalledTimes(1);
  });

  test('batch', () => {
    const spy = jest.fn();
    const x = box(0);
    const y = box(0);

    on(() => get(x) + get(y), (v) => spy(v));

    set(x, 1);
    set(y, 1);
    expect(spy).toBeCalledTimes(2); spy.mockReset();

    batch(() => {
      set(x, 2);
      set(y, 2);
    });
    expect(spy).toBeCalledTimes(1); spy.mockReset();

    const fn = batch.fn((k: number) => {
      set(x, k);
      set(y, k);
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

    const a_fn = () => get(a);
    const b_fn = () => untrack(() => get(b));
    const c_fn = untrack.fn(() => get(c));

    sync(() => {
      a_fn();
      b_fn();
      c_fn();
      return {};
    }, spy);

    spy.mockReset();
    set(a, 1);
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    set(b, 1);
    set(c, 1);
    expect(spy).toBeCalledTimes(0);

    untrack(spy, 10, 11, 12);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(10, 11, 12);
    spy.mockReset();
  });
});

