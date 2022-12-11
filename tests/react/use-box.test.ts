import { html } from 'htm/react';
import { render, fireEvent, screen } from '@testing-library/react';
import { box, set } from 'remini';
import { useBox } from 'remini/react';

describe('should work react', () => {

  test('useBox', () => {
    const spy = jest.fn();
    const h = box(0);

    function A() {
      const val = useBox(h);
      spy(val);
      return html`<button onClick=${() => set(h, 20)} />`;
    }

    render(html`<${A} />`);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

});
