import { Event } from 'evemin';
export { event, Event } from 'evemin';

type Mode = 'writable' | 'readable';

export type Box<T, M extends Mode = 'readable'> = [
  () => T,
  M extends 'writable'
    ? ((value: T) => void)
    : ((value: T) => void) | void
]

export declare const box: <T = void>(value: T) => Box<T, 'writable'>;
export declare const update: <P>(box: Box<P, 'writable'> | BoxFaceWritableClass<P>, fn: (value: P) => P) => void;
export declare const get: <P>(box: Box<P> | BoxFaceClass<P>) => P;
export declare const getter: <P>(box: Box<P> | BoxFaceClass<P>) => () => P;
export declare const set: <P>(box: Box<P, 'writable'> | BoxFaceWritableClass<P>, value: P) => void;
export declare const setter: <P>(box: Box<P, 'writable'> | BoxFaceWritableClass<P>) => (value: P) => P;

export declare const val: typeof get;
export declare const put: typeof set;

/** @deprecated will be removed in 2.0.0, use "get" method instead */
export declare const read: typeof get;

/** @deprecated will be removed in 2.0.0, use "set" method instead */
export declare const write: typeof set;

/** @deprecated will be removed in 2.0.0, use "wrap" method instead */
export declare const select: {
  <P, R>(box: Box<P> | BoxFaceClass<P>, fn: (value: P) => R): Box<R>;
}


export declare const wrap: {
  <P>(
    getter: (() => P) | Box<P> |  BoxFaceClass<P>,
  ): Box<P>;
  <P>(
    getter: (() => P) | Box<P> | BoxFaceClass<P>,
    setter: ((value: P) => void) | Box<P, 'writable'> | BoxFaceWritableClass<P>
  ): Box<P, 'writable'>;
}

export declare const readonly: <P>(box: Box<P> | BoxFaceClass<P>) => Box<P>;

export declare const on: {
  <P>(
    target: (() => P) | Box<P> | Event<P> | BoxFaceClass<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
};
export declare const once: {
  <P>(
    target: (() => P) | Box<P> | Event<P> | BoxFaceClass<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}
export declare const sync: {
  <P>(
    target: (() => P) | Box<P> | BoxFaceClass<P>,
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
    target: (() => P) | Box<P> | Event<P> | BoxFaceClass<P>
  ): Promise<P>;
};

export declare const promiseTruthy: PromiseFunction;
export declare const promiseFalsy: PromiseFunction;
export declare const promiseNext: PromiseFunction;

export declare const waitTruthy: PromiseFunction;
export declare const waitFalsy: PromiseFunction;
export declare const waitNext: PromiseFunction;

export declare class BoxFaceClass<T = void> {
  0: () => T;
  constructor(getter: () => T);
}
export declare class BoxFaceWritableClass<T = void> extends BoxFaceClass<T> {
  1: (value: T) => void;
  constructor(getter: () => T, setter: (value: T) => void);
}
export declare class BoxClass<T = void> extends BoxFaceWritableClass<T> {
  constructor(value: T);
}
