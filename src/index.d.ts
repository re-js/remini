
type Mode = 'writable' | 'readable';

export type BoxReadable<T, M extends Mode = 'readable'> = [
  () => T,
  M extends 'writable'
    ? ((value: T) => void)
    : ((value: T) => void) | void
]

export type Box<T> = BoxReadable<T, 'writable'>;

export declare const box: <T>(value: T) => Box<T>;
export declare const update: <P>(box: Box<P>, fn: (value: P) => P) => void;
export declare const read: <P>(box: BoxReadable<P>) => P;
export declare const write: <P>(box: Box<P>, value: P) => void;

export declare const wrap: {
  <P>(
    getter: (() => P) | BoxReadable<P>,
  ): BoxReadable<P>;
  <P>(
    getter: (() => P) | BoxReadable<P>,
    setter: ((value: P) => void) | Box<P>
  ): Box<P>;
}

export declare const readonly: <P>(box: Box<P>) => BoxReadable<P>;

type Subscriber = {
  <P>(
    target: (() => P) | BoxReadable<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}

export declare const on: Subscriber;
export declare const once: Subscriber;
export declare const sync: Subscriber;

export declare const map: {
  <T, R>(box: BoxReadable<T>, fn: (value: T) => R): BoxReadable<R>;
}

type Zone = {
  <T>(fn: () => T): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}

export declare const batch: Zone;
export declare const untrack: Zone;
