import {
  box, get, put,
  promiseTruthy, promiseFalsy, promiseNext,
  event
} from 'remini';

const wait_next_tick = () => new Promise<void>(r => r());

describe('promise feature', () => {

  test('promiseTruthy works', async () => {
    const spy = jest.fn();
    const a = box(0);
    promiseTruthy(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    put(a, 2);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = box(0);
    promiseTruthy(() => get(a) && get(b)).then(spy);
    put(a, 0);
    put(b, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const e = event<void | string | number>();
    promiseTruthy(e).then(spy);
    e();
    e('');
    e(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    e(true as any);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();
  });

  test('promiseFalsy works', async () => {
    const spy = jest.fn();
    const a = box(0);
    promiseFalsy(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = event<number>();
    promiseFalsy(b).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    b(1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    b(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    b(1);
    b(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const c = box(0);
    promiseFalsy(() => get(c) - 1).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(c, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
  });

  test('promiseNext works', async () => {
    const spy = jest.fn();
    const a = box(0);
    promiseNext(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = box(1);
    promiseNext(b).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(b, 0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const c = event<number>();
    promiseNext(c).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    c(1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const d = event<number>();
    promiseNext(d).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    d(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();
  });

  test('stopped after invoke', async () => {
    const spy = jest.fn();
    const spy_call = jest.fn();

    const a = box(0);
    promiseTruthy(() => (spy_call(), get(a) === 5)).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    put(a, 2);
    put(a, 3);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    expect(spy_call).toBeCalledTimes(4);
    spy_call.mockReset();

    put(a, 5);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    expect(spy_call).toBeCalledTimes(1);
    spy_call.mockReset();

    put(a, 1);
    expect(spy_call).toBeCalledTimes(0);
  });

  test('box returns value', async () => {
    const spy = jest.fn();

    const a = box(0);
    promiseTruthy(a).then(spy);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(1);
  });

  test('fn returns value', async () => {
    const spy = jest.fn();

    const a = box(5);
    promiseTruthy(() => get(a) - 5).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0)
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(-4);
  });

  test('event returns value', async () => {
    const spy = jest.fn();

    const a = event<number>();
    promiseTruthy(a).then(spy);
    a(3);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(3);
  });

});

