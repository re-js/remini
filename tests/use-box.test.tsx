import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { box, useBox, write } from 'remini';

describe('should work', () => {

  test('useBox', () => {
    const spy = jest.fn();
    const h = box(0);

    function A() {
      const val = useBox(h);
      spy(val);
      return <button onClick={() => write(h, 20)} />;
    }

    render(<A />);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

});
