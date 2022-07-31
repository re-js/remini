
type Mode = 'writable' | 'readable';

export type Box<T, M extends Mode = 'writable'> = [
  () => T,
  M extends 'writable'
    ? ((value: T) => void)
    : ((value: T) => void) | void
]

export declare const box: <T>(value: T) => Box<T>;
export declare const update: <P>(box: Box<P>, fn: (value: P) => P) => void;
export declare const read: <P>(box: Box<P, 'readable'>) => P;
export declare const write: <P>(box: Box<P>, value: P) => void;

export declare const wrap: {
  <P>(
    getter: (() => P) | Box<P, 'readable'>,
  ): Box<P, 'readable'>;
  <P>(
    getter: (() => P) | Box<P, 'readable'>,
    setter: ((value: P) => void) | Box<P>
  ): Box<P>;
}

export declare const readonly: <P>(box: Box<P>) => Box<P, 'readable'>;

type Subscriber = {
  <P>(
    target: (() => P) | Box<P, 'readable'>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}

export declare const on: Subscriber & {
  once: Subscriber
};
export declare const sync: Subscriber;

export declare const map: {
  <P, R>(box: Box<P, 'readable'>, fn: (value: P) => R): Box<R, 'readable'>;
}

type Area = {
  <T>(fn: () => T): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}

export declare const batch: Area;
export declare const untrack: Area;
