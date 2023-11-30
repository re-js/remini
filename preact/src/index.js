import { useReducer, useEffect, useRef, useMemo } from 'preact/hooks';
import { bindings } from 'remini/hooks-bindings';

//
// Exports
//

const {
  component,
  useBox,
  useBoxes,
} = bindings(
  useReducer,
  useEffect,
  useRef,
  useMemo
);

export {
  component,
  useBox,
  useBoxes,
}
