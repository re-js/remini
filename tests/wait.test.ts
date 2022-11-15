import {
  box, val, put,
  waitTruthy, waitFalsy, waitNext,
  event
} from 'remini';

const wait_next_tick = () => new Promise<void>(r => r());

describe('wait feature', () => {

  test('waitTruthy works', async () => {
    const spy = jest.fn();
    const a = box(0);
    waitTruthy(a).then(spy);
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
    waitTruthy(() => val(a) && val(b)).then(spy);
    put(a, 0);
    put(b, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const e = event<void | string | number>();
    waitTruthy(e).then(spy);
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

  test('waitFalsy works', async () => {
    const spy = jest.fn();
    const a = box(0);
    waitFalsy(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = event<number>();
    waitFalsy(b).then(spy);
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
    waitFalsy(() => val(c) - 1).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(c, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
  });

  test('waitNext works', async () => {
    const spy = jest.fn();
    const a = box(0);
    waitNext(a).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = box(1);
    waitNext(b).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(b, 0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const c = event<number>();
    waitNext(c).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    c(1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const d = event<number>();
    waitNext(d).then(spy);
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
    waitTruthy(() => (spy_call(), val(a) === 5)).then(spy);
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
    waitTruthy(a).then(spy);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(1);
  });

  test('fn returns value', async () => {
    const spy = jest.fn();

    const a = box(5);
    waitTruthy(() => val(a) - 5).then(spy);
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
    waitTruthy(a).then(spy);
    a(3);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(3);
  });

});

