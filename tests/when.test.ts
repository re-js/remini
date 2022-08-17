import {
  box, wrap, read, write, update, readonly,
  on, sync,
  select, batch, untrack,
  when,
  event
} from 'remini';

const wait_next_tick = () => new Promise<void>(r => r());

describe('when feature', () => {

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

  test('when with filter', async () => {
    const spy = jest.fn();

    const a = event<number>();
    when(a, (v) => v === 5).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    a(1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    a(5);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    const b = box(5);
    when(b, (v) => v === 5).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    when(b, (v) => v === 1).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(b, 0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(b, 1);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    when(() => read(b) + 1, (v) => v === 1).then(spy);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(b, 2);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(0);
    write(b, 0);
    await wait_next_tick();
    expect(spy).toBeCalledTimes(1);
  });
});

