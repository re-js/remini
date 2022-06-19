
export {
  box, wrap, read, write, update, readonly,
  on, once, sync, cycle,
  event, fire, filter, map,
  unsubs, un,
  batch, untrack,
  observe, useBox, useBoxes, useJsx,
  prop, cache,
  key_remini,

  Box
};

declare const key_remini: '.remini';

interface Box<T> {}

declare const box: <T>(value: T) => Box<T>;
declare const update: <P>(box: Box<P>, fn: (value: P) => P) => void;
declare const read: <P>(box: Box<P>) => P;
declare const write: <P>(box: Box<P>, value: P) => void;

declare const wrap: <P>(
  getter: (() => P) | Box<P>,
  setter?: ((value: P) => void) | Box<P>
) => Box<P>;

declare const readonly: <P>(box: Box<P>) => Box<P>;


declare function on(...args: any[]): any;
declare function once(...args: any[]): any;
declare function sync(...args: any[]): any;
declare function cycle(...args: any[]): any;

declare function event(...args: any[]): any;
declare function fire(...args: any[]): any;
declare function filter(...args: any[]): any;
declare function map(...args: any[]): any;

declare function unsubs(...args: any[]): any;
declare function un(...args: any[]): any;

declare function batch(...args: any[]): any;
declare function untrack(...args: any[]): any;

declare const prop: any;
declare const cache: any;

declare const observe: any;

declare const useBox: <P>(box: Box<P>) => P;

declare const useBoxes: {
  <A>(boxes: [Box<A>]): [A];
  <A,B>(boxes: [Box<A>,Box<B>]): [A,B];
  <A,B,C>(boxes: [Box<A>,Box<B>,Box<C>]): [A,B,C];
  <A,B,C,D>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>]): [A,B,C,D];
  <A,B,C,D,E>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>,Box<E>]): [A,B,C,D,E];
  <A,B,C,D,E,F>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>,Box<E>,Box<F>]): [A,B,C,D,E,F];
}

declare function useJsx(...args: any[]): any;
