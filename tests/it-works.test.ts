import {
  box, wrap, read, write, update, readonly,
  on, sync,
  select, batch, untrack,
  when,
  event
} from 'remini';

const wait_next_tick = () => new Promise<void>(r => r());

describe('should works', () => {

  test('re, read, write', () => {
    const a = box(0);
    write(a, 10);
    expect(read(a)).toBe(10);
  });

  test('update', () => {
    const a = box(0);
    update(a, (v) => v + 3);
    expect(read(a)).toBe(3);
  });

  test('wrap', () => {
    const a = box(1);
    const b = box(2);

    const k = wrap(a);
    const p = wrap(() => read(a) + read(a));
    const n = wrap(a, (v) => write(a, v + 1));
    const m = wrap(() => read(a) + 2, (n) => update(b, (v) => v + n));
    const q = wrap(b, b);

    expect(read(k)).toBe(1);
    expect(read(p)).toBe(2);
    expect(read(n)).toBe(1);
    expect(read(m)).toBe(3);

    write(n, 10);
    expect(read(k)).toBe(11);
    expect(read(p)).toBe(22);
    expect(read(n)).toBe(11);
    expect(read(m)).toBe(13);

    write(m, 10);
    expect(read(b)).toBe(12);

    update(q, (v) => v + 10);
    expect(read(q)).toBe(22);
  });

  test('box select', () => {
    const a = box(1);
    const b = box(2);

    const k = select(a, (v) => v + 5);
    const n = select(k, (v) => '&' + v);
    const m = select(b, (v) => v + read(n));

    expect(read(m)).toBe('2&6');
    write(a, 10);
    expect(read(m)).toBe('2&15');

    update(b, (v) => v + 3);
    expect(read(m)).toBe('5&15');
  });

  test('readonly', () => {
    const a = box(1);
    const k = readonly(a);

    expect(read(k)).toBe(1);
    update(a, (v) => v + 1);
    expect(read(k)).toBe(2);

    expect(() => write(k as any, 10)).toThrow();
    expect(() => update(k as any, (v: number) => v + 1)).toThrow();
  });

  test('on', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    on(() => read(a) + read(b), (v) => x(v));
    on(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    write(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    write(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('sync', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(1);
    const b = box(2);

    sync(() => read(a) + read(b), (v) => x(v));
    sync(a, (v) => y(v));

    expect(x).toBeCalledWith(3); x.mockReset();
    expect(y).toBeCalledWith(1); y.mockReset();

    write(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    write(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('batch', () => {
    const spy = jest.fn();
    const x = box(0);
    const y = box(0);

    on(() => read(x) + read(y), (v) => spy(v));

    write(x, 1);
    write(y, 1);
    expect(spy).toBeCalledTimes(2); spy.mockReset();

    batch(() => {
      write(x, 2);
      write(y, 2);
    });
    expect(spy).toBeCalledTimes(1); spy.mockReset();

    const fn = batch.fn((k: number) => {
      write(x, k);
      write(y, k);
    });
    fn(5);
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    fn(0);
    expect(spy).toBeCalledTimes(1); spy.mockReset();

  });

  test('untrack', () => {
    const spy = jest.fn();
    const a = box(0);
    const b = box(0);
    const c = box(0);

    const a_fn = () => read(a);
    const b_fn = () => untrack(() => read(b));
    const c_fn = untrack.fn(() => read(c));

    sync(() => {
      a_fn();
      b_fn();
      c_fn();
      return {};
    }, spy);

    spy.mockReset();
    write(a, 1);
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    write(b, 1);
    write(c, 1);
    expect(spy).toBeCalledTimes(0);
  });

  test('when', async () => {
    const spy = jest.fn();

    const a = box(0);
    when(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    write(a, 2);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = box(0);
    when(() => read(a) && read(b)).then(spy);
    write(a, 0);
    write(b, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const e = event<void | string | number>();
    when(e).then(spy);
    e();
    e('');
    e(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    e(1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();
  });

  test('when stopped after invoke', async () => {
    const spy = jest.fn();
    const spy_call = jest.fn();

    const a = box(0);
    when(() => (spy_call(), read(a) === 5)).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(a, 1);
    write(a, 2);
    write(a, 3);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    expect(spy_call).toBeCalledTimes(4);
    spy_call.mockReset();

    write(a, 5);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    expect(spy_call).toBeCalledTimes(1);
    spy_call.mockReset();

    write(a, 1);
    expect(spy_call).toBeCalledTimes(0);
  });

  test('when can be immediately', async () => {
    const spy = jest.fn();
    const spy_call = jest.fn();

    const a = box(5);
    when(() => (spy_call(), read(a) === 5)).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
  });
});

