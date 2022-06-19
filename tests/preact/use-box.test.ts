import { html } from 'htm/preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import { box, write } from 'remini';
import { useBox } from 'remini/preact';

describe('should work preact', () => {

  test('useBox', () => {
    const spy = jest.fn();
    const h = box(0);

    function A() {
      const val = useBox(h);
      spy(val);
      return html`<button onClick=${() => write(h, 20)} />`;
    }

    render(html`<${A} />`);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

});
