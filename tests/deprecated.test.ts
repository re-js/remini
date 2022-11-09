import {
  read, write, select,
  val, put, box, update
} from 'remini';

describe('deprecated methods', () => {

  test('write', () => {
    expect(write).toBe(put);
  });

  test('read', () => {
    expect(read).toBe(val);
  });

  test('select', () => {
    const a = box(1);
    const b = box(2);

    const k = select(a, (v) => v + 5);
    const n = select(k, (v) => '&' + v);
    const m = select(b, (v) => v + val(n));

    expect(val(m)).toBe('2&6');
    put(a, 10);
    expect(val(m)).toBe('2&15');

    update(b, (v) => v + 3);
    expect(val(m)).toBe('5&15');
  });

});
