import {
  box, read, write,
  on, sync
} from 'remini';
import {
  unsubscriber,
  collect,
  run
} from 'unsubscriber';

describe('should works', () => {

  test('attach unsubscriber', () => {
    const spy_sync = jest.fn();
    const spy_on = jest.fn();
    const a = box(0);

    const un = unsubscriber();
    collect(un, () => {
      sync(a, spy_sync);
      on(a, spy_on);
    });

    expect(spy_sync).toBeCalledTimes(1); spy_sync.mockReset();
    expect(spy_on).toBeCalledTimes(0); spy_on.mockReset();
    write(a, 10);
    expect(spy_sync).toBeCalledTimes(1); spy_sync.mockReset();
    expect(spy_on).toBeCalledTimes(1); spy_on.mockReset();

    run(un);
    write(a, 11);
    expect(spy_sync).toBeCalledTimes(0);
    expect(spy_on).toBeCalledTimes(0);

    expect(read(a)).toBe(11);
  });


});
