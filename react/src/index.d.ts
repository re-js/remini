import { FC, ForwardRefRenderFunction, MemoExoticComponent } from 'react';
import { Box } from 'remini';

type ComponentMemoDecorator = {
  <P extends object>(component: FC<P>): MemoExoticComponent<FC<P>>;
}

type ComponentDecorator = {
  <P extends object, Ref = {}>(component: ForwardRefRenderFunction<Ref, P>): ForwardRefRenderFunction<Ref, P>
}

export declare const component: ComponentMemoDecorator & {
  nomemo: ComponentDecorator
}
export declare const useBox: <P>(box: Box<P, 'readable'>) => P;
export declare const useBoxes: {
  <A>(boxes: [Box<A, 'readable'>]): [A];
  <A,B>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>]): [A,B];
  <A,B,C>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>]): [A,B,C];
  <A,B,C,D>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>]): [A,B,C,D];
  <A,B,C,D,E>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>,Box<E, 'readable'>]): [A,B,C,D,E];
  <A,B,C,D,E,F>(boxes: [Box<A, 'readable'>,Box<B, 'readable'>,Box<C, 'readable'>,Box<D, 'readable'>,Box<E, 'readable'>,Box<F, 'readable'>]): [A,B,C,D,E,F];
}
