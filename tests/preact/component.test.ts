import { html } from 'htm/preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import { box, val, put } from 'remini';
import { component } from 'remini/preact';

describe('should work preact', () => {

  test('observe', () => {
    const spy = jest.fn();
    const b = box(0);

    const A = component(() => {
      spy(val(b));
      return html`<button onClick=${() => put(b, 20)} />`;
    });

    render(html`<${A} />`);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

});
