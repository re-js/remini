const { useReducer, useEffect, useRef, useMemo } = require('preact/hooks');
const bindings = require('remini/hooks-bindings');

//
// Exports
//

module.exports = bindings(
  useReducer,
  useEffect,
  useRef,
  useMemo
);
