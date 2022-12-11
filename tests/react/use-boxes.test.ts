import { html } from 'htm/react';
import { render, act } from '@testing-library/react';
import { box, set } from 'remini';
import { useBoxes } from 'remini/react';

describe('should work react', () => {

  test('useBoxes', () => {
    const spy = jest.fn();
    const $a = box(0);
    const $b = box(0);

    function A() {
      const [a,b] = useBoxes([$a, $b]);
      spy(a, b);
      return html`<i></i>`;
    }

    render(html`<${A} />`);
    expect(spy).toBeCalledWith(0, 0); spy.mockReset();

    act(() => set($a, 1));
    expect(spy).toBeCalledWith(1, 0); spy.mockReset();

    act(() => set($b, 5));
    expect(spy).toBeCalledWith(1, 5); spy.mockReset();
  });

});
