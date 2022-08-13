import { FunctionComponent } from 'preact';
import { Box } from 'remini';

type ComponentDecorator = {
  <P extends object>(component: FunctionComponent<P>): FunctionComponent<P>;
}

export declare const component: ComponentDecorator;
export declare const useBox: <P>(box: Box<P>) => P;
export declare const useBoxes: {
  <A>(boxes: [Box<A>]): [A];
  <A,B>(boxes: [Box<A>,Box<B>]): [A,B];
  <A,B,C>(boxes: [Box<A>,Box<B>,Box<C>]): [A,B,C];
  <A,B,C,D>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>]): [A,B,C,D];
  <A,B,C,D,E>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>,Box<E>]): [A,B,C,D,E];
  <A,B,C,D,E,F>(boxes: [Box<A>,Box<B>,Box<C>,Box<D>,Box<E>,Box<F>]): [A,B,C,D,E,F];
}
