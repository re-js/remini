
export declare const key_remini: '.re';

export interface Box<T> {}

export declare const box: <T>(value: T) => Box<T>;
export declare const update: <P>(box: Box<P>, fn: (value: P) => P) => void;
export declare const read: <P>(box: Box<P>) => P;
export declare const write: <P>(box: Box<P>, value: P) => void;

export declare const wrap: <P>(
  getter: (() => P) | Box<P>,
  setter?: ((value: P) => void) | Box<P>
) => Box<P>;

export declare const readonly: <P>(box: Box<P>) => Box<P>;


export declare function on(...args: any[]): any;
export declare function once(...args: any[]): any;
export declare function sync(...args: any[]): any;

export declare function map(...args: any[]): any;

export declare const batch: {
  <T>(fn: () => T): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}
export declare const untrack: {
  <T>(fn: () => T): T;
  fn: <M extends ((...args: any[]) => any)>(fn: M) => M;
}
