import { forwardRef } from 'react';
import { html } from 'htm/react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, screen } from '@testing-library/react';
import { box, get, set, update } from 'remini';
import { component } from 'remini/react';

type ForwardRefButtonProps = {
  r: any;
  onClick: () => void;
};
const ForwardRefButton = forwardRef<HTMLButtonElement, ForwardRefButtonProps>(
  component.nomemo((props, ref) => (
    html`<button ref=${ref} onClick=${props.onClick}>
      ${get(props.r)}
    </button>`
  ))
);

describe('should work react', () => {

  test('observe', () => {
    const spy = jest.fn();
    const h = box(0);

    const A = component(() => {
      spy(get(h));
      return html`<button onClick=${() => set(h, 20)} />`;
    });

    render(html`<${A} />`);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

  test('observe with ref forwarding', () => {
    let node;

    const r = box('');
    const add = () => update(r, (v) => v + 'a');

    function A() {
      return html`<${ForwardRefButton} onClick=${add} r=${r} ref=${(n: any) => (node = n)} />`;
    }

    render(html`<${A} />`);

    expect(node).toBeInstanceOf(HTMLButtonElement);

    expect(screen.getByRole('button').textContent).toBe('');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).toBe('a');
  });

  test('observe memo', () => {
    const spy = jest.fn();

    const a = box(0);
    const b = box(0);

    const B = component(() => (spy(), html`<i>${get(b)}</i>`));
    const A = component(() => html`<u><b>${get(a)}</b><${B} /></u>`);

    render(html`<${A} />`);

    expect(spy).toBeCalledTimes(1); spy.mockReset();

    act(() => set(a, 1));
    expect(spy).toBeCalledTimes(0);
    act(() => set(b, 1));
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    act(() => set(b, 2));
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    act(() => set(a, 2));
    expect(spy).toBeCalledTimes(0);
  });

});
