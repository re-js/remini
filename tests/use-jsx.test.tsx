import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { box, useBox, write, useJsx, read } from 'remini';

describe('should work', () => {

  test('useJsx', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = box(0);
    const b = box(10);

    const A = () => {
      x();
      useBox(a);
      const B = useJsx(() => (y(), read(b), <></>))
      return <B></B>;
    }

    render(<A />);
    expect(x).toBeCalledTimes(1); x.mockReset();
    expect(y).toBeCalledTimes(1); y.mockReset();

    act(() => write(a, 1));
    expect(x).toBeCalledTimes(1); x.mockReset();
    expect(y).toBeCalledTimes(0);

    act(() => write(b, 1));
    expect(x).toBeCalledTimes(0);
    expect(y).toBeCalledTimes(1); y.mockReset();

    act(() => write(b, 2));
    expect(x).toBeCalledTimes(0);
    expect(y).toBeCalledTimes(1); y.mockReset();

    act(() => write(a, 2));
    expect(x).toBeCalledTimes(1); x.mockReset();
    expect(y).toBeCalledTimes(0);
  });

});
