const { useReducer, useEffect, useRef, useMemo, memo } = require('react');
const bindings = require('remini/hooks-bindings');

//
// Exports
//

module.exports = bindings(
  useReducer,
  useEffect,
  useRef,
  useMemo,
  memo
);
