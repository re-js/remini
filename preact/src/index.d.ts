import { FunctionComponent } from 'preact';
import { Box } from 'remini';

type ComponentDecorator = {
  <P extends object>(component: FunctionComponent<P>): FunctionComponent<P>;
}

export declare const component: ComponentDecorator;
export declare const useBox: <P>(box: Box<P, 'readable'>) => P;
export declare const useBoxes: {
  <A>(boxes: [Box<A, 'readable'>]): [A];
  <A,B>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>]): [A,B];
  <A,B,C>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>]): [A,B,C];
  <A,B,C,D>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>]): [A,B,C,D];
  <A,B,C,D,E>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>,Box<E, 'readable'>]): [A,B,C,D,E];
  <A,B,C,D,E,F>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>,Box<E, 'readable'>,Box<F, 'readable'>]): [A,B,C,D,E,F];
}
