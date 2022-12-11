import {
  read, write, select, val, put,
  get, set, box, update
} from 'remini';

describe('deprecated methods', () => {

  test('val', () => {
    expect(val).toBe(get);
  });

  test('put', () => {
    expect(put).toBe(set);
  });

  test('write', () => {
    expect(write).toBe(set);
  });

  test('read', () => {
    expect(read).toBe(get);
  });

  test('select', () => {
    const a = box(1);
    const b = box(2);

    const k = select(a, (v) => v + 5);
    const n = select(k, (v) => '&' + v);
    const m = select(b, (v) => v + get(n));

    expect(get(m)).toBe('2&6');
    set(a, 10);
    expect(get(m)).toBe('2&15');

    update(b, (v) => v + 3);
    expect(get(m)).toBe('5&15');
  });

});
