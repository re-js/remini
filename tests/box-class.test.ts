import {
  get, on,
  BoxClass,
  update
} from 'remini';

class AB extends BoxClass<{ a: number; b: number; }> {
  constructor(a, b) {
    super({ a, b })
  }
  get a() {
    return get(this).a;
  }
  getState() {
    return get(this);
  }
  get b() {
    return this.getState().b;
  }
}

describe('class feature', () => {

  test('it works', () => {
    const spy = jest.fn();
    const a = new AB(1,5);
    expect(a.a).toBe(1);
    expect(a.b).toBe(5);

    on(a, state => spy(state));
    expect(spy).toBeCalledTimes(0);

    update(a, state => ({
      ...state,
      b: 6,
      c: 11
    }));

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ a: 1, b: 6, c: 11 });
    expect(a.b).toBe(6);
  });

});
