import { useReducer, useEffect, useRef, useMemo, memo } from 'react';
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
  useMemo,
  memo
);

export {
  component,
  useBox,
  useBoxes,
}
