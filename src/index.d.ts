import { Event } from 'evemin';
export { event, Event } from 'evemin';

type Mode = 'writable' | 'readable';

export type Box<T, M extends Mode = 'readable'> = [
  () => T,
  M extends 'writable'
    ? ((value: T) => void)
    : ((value: T) => void) | void
]

export declare const box: <T>(value: T) => Box<T, 'writable'>;
export declare const update: <P>(box: Box<P, 'writable'>, fn: (value: P) => P) => void;
export declare const get: <P>(box: Box<P>) => P;
export declare const put: <P>(box: Box<P, 'writable'>, value: P) => void;

/** @deprecated will be removed in 2.0.0, use "get" method instead */
export declare const val: typeof get;

/** @deprecated will be removed in 2.0.0, use "get" method instead */
export declare const read: typeof get;

/** @deprecated will be removed in 2.0.0, use "put" method instead */
export declare const write: typeof put;

/** @deprecated will be removed in 2.0.0, use "wrap" method instead */
export declare const select: {
  <P, R>(box: Box<P>, fn: (value: P) => R): Box<R>;
}


export declare const wrap: {
  <P>(
    getter: (() => P) | Box<P>,
  ): Box<P>;
  <P>(
    getter: (() => P) | Box<P>,
    setter: ((value: P) => void) | Box<P, 'writable'>
  ): Box<P, 'writable'>;
}

export declare const readonly: <P>(box: Box<P>) => Box<P>;

export declare const on: {
  <P>(
    target: (() => P) | Box<P> | Event<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
};
export declare const once: {
  <P>(
    target: (() => P) | Box<P> | Event<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}
export declare const sync: {
  <P>(
    target: (() => P) | Box<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}

type Area = {
  <T, M extends any[]>(fn: ((...args: M) => T), ...args: M): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}

export declare const batch: Area;
export declare const untrack: Area;

type PromiseFunction = {
  <P>(
    target: (() => P) | Box<P> | Event<P>
  ): Promise<P>;
};

export declare const promiseTruthy: PromiseFunction;
export declare const promiseFalsy: PromiseFunction;
export declare const promiseNext: PromiseFunction;
