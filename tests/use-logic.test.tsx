import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { on, box, map, useBox, write, useLogic, read, useJsx, Box } from 'remini';

describe('should work', () => {

  test('useLogic with object return', () => {
    const x = jest.fn();
    const y = jest.fn();

    let a: Box<number>;
    const L = () => {
      a = box(0);
      return { a }
    }

    function A() {
      const c = useLogic(L);
      y()
      const B = useJsx(() => (x(), <i>{read(c.a)}</i>));
      return <B></B>;
    }

    render(<A />);
    expect(x).toBeCalledTimes(1); x.mockReset();
    expect(y).toBeCalledTimes(1); y.mockReset();

    act(() => write(a, 1));
    expect(x).toBeCalledTimes(1); x.mockReset();
    expect(y).toBeCalledTimes(0);
  });

  test('useLogic with box return', () => {
    const x = jest.fn();
    const y = jest.fn();

    const h = box([1,10]);
    const k = box(100)

    const L = (params) => {
      on(params, (o) => x(o));
      return map(params, (v) => v[0] + v[1] + read(k));
    }

    function A() {
      const h_val = useBox(h);
      const c = useLogic(L, h_val);
      y(c)
      return <i></i>;
    }

    render(<A />);
    expect(x).toBeCalledTimes(0);
    expect(y).toBeCalledWith(111); y.mockReset();

    act(() => write(h, [2, 20]));
    expect(x).toBeCalledWith([2, 20]); x.mockReset();
    expect(y).toBeCalledWith(122); y.mockReset();

    act(() => write(k, 200));
    expect(x).toBeCalledTimes(0); x.mockReset();
    expect(y).toBeCalledWith(222); y.mockReset();
  });

});
