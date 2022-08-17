import {
  on,
  event
} from 'remini';
import { unsubscriber, collect, run } from 'unsubscriber';

describe('event feature', () => {

  test('on', () => {
    const spy = jest.fn();

    const e = event<number>();

    on(e, spy);
    expect(spy).toBeCalledTimes(0);

    e(10);
    expect(spy).toBeCalledWith(10, void 0);
    spy.mockReset();

    e(10);
    expect(spy).toBeCalledWith(10, 10);
    spy.mockReset();
  });

  test('on with un', () => {
    const spy = jest.fn();

    const e = event<number>();
    const unsubs = unsubscriber();

    collect(unsubs, () => {
      on(e, spy);
    });

    expect(spy).toBeCalledTimes(0);

    e(10);
    expect(spy).toBeCalledTimes(1);
    spy.mockReset();

    run(unsubs);

    e(10);
    expect(spy).toBeCalledTimes(0);
  });

});

