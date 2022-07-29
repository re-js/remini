import { BoxReadable } from 'remini';

export declare const observe: any;
export declare const useBox: <P>(box: BoxReadable<P>) => P;
export declare const useBoxes: {
  <A>(boxes: [BoxReadable<A>]): [A];
  <A,B>(boxes: [BoxReadable<A>,BoxReadable<B>]): [A,B];
  <A,B,C>(boxes: [BoxReadable<A>,BoxReadable<B>,BoxReadable<C>]): [A,B,C];
  <A,B,C,D>(boxes: [BoxReadable<A>,BoxReadable<B>,BoxReadable<C>,BoxReadable<D>]): [A,B,C,D];
  <A,B,C,D,E>(boxes: [BoxReadable<A>,BoxReadable<B>,BoxReadable<C>,BoxReadable<D>,BoxReadable<E>]): [A,B,C,D,E];
  <A,B,C,D,E,F>(boxes: [BoxReadable<A>,BoxReadable<B>,BoxReadable<C>,BoxReadable<D>,BoxReadable<E>,BoxReadable<F>]): [A,B,C,D,E,F];
}
