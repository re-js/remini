import {
  box, val, put,
  promise,
  event
} from 'remini';

const wait_next_tick = () => new Promise<void>(r => r());

describe('promise feature', () => {

  test('works', async () => {
    const spy = jest.fn();
    const a = box(0);
    promise(a).then(spy);
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
    promise(() => val(a) && val(b)).then(spy);
    put(a, 0);
    put(b, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const e = event<void | string | number>();
    promise(e).then(spy);
    e();
    e('');
    e(0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();
  });

  test('stopped after invoke', async () => {
    const spy = jest.fn();
    const spy_call = jest.fn();

    const a = box(0);
    promise(() => (spy_call(), val(a) === 5)).then(spy);
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
    promise(a).then(spy);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(1);
  });

  test('fn returns value', async () => {
    const spy = jest.fn();

    const a = box(0);
    promise(() => val(a) + 1).then(spy);
    put(a, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(2);
  });

  test('event returns value', async () => {
    const spy = jest.fn();

    const a = event<number>();
    promise(a).then(spy);
    a(3);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(3);
  });

});

