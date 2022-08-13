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
export declare const read: <P>(box: Box<P>) => P;
export declare const write: <P>(box: Box<P, 'writable'>, value: P) => void;

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

type Subscriber = {
  <P>(
    target: (() => P) | Box<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}

export declare const on: {
  <P>(
    target: (() => P) | Box<P> | Event<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
};
export declare const sync: {
  <P>(
    target: (() => P) | Box<P>,
    listener: (value: P, prev: P | void) => void
  ): () => void;
}

export declare const select: {
  <P, R>(box: Box<P>, fn: (value: P) => R): Box<R>;
}

type Area = {
  <T>(fn: () => T): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}

export declare const batch: Area;
export declare const untrack: Area;

export declare const un: (unsubscriber: () => void) => () => void;
