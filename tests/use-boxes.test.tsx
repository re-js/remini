import React from 'react';
import { render, act } from '@testing-library/react';
import { box, useBoxes, write } from 'remini';

describe('should work', () => {

  test('useBoxes', () => {
    const spy = jest.fn();
    const $a = box(0);
    const $b = box(0);

    function A() {
      const [a,b] = useBoxes([$a, $b]);
      spy(a, b);
      return <></>;
    }

    render(<A />);
    expect(spy).toBeCalledWith(0, 0); spy.mockReset();

    act(() => write($a, 1));
    expect(spy).toBeCalledWith(1, 0); spy.mockReset();

    act(() => write($b, 5));
    expect(spy).toBeCalledWith(1, 5); spy.mockReset();
  });

});
