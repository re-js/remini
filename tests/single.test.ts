import { single, free, un, mock, unmock } from 'remini';

describe('should work', () => {

  test('with classes', () => {
    const spy = jest.fn();
    const destr = jest.fn();
    class A {
      constructor() {
        spy();
        un(destr);
      }
    }
    single(A);
    expect(spy).toBeCalledTimes(1);

    expect(destr).not.toBeCalled();
    free(A);
    expect(destr).toBeCalled();

    single(A);
    expect(spy).toBeCalledTimes(2);
  });

  test('with arrow functions', () => {
    const spy = jest.fn().mockReturnValue(10);
    const A = () => spy();

    expect(single(A)).toBe(10);
    expect(single(A)).toBe(10);
    expect(spy).toBeCalledTimes(1);
  });

  test('mock and unmock', () => {
    const A = () => 10;
    expect(single(A)).toBe(10);
    mock(A, 15);
    expect(single(A)).toBe(15);
    unmock(A);
    expect(single(A)).toBe(10);
  });

});
