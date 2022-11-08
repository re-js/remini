# Shared state with Remini

The key to winning is the shared state and logic. Pure React doesn't have a convenient way to organize shared states that can be used whole the application. 

Suggested React ways are passing state by props thought nesting components from parent to child, and using Context for giving shared access to some state values in children components. Both ways can't share state with any part of your app!

Architecture with a shared state provides more simplest code. You can control your state and logic in separate files that can be accessed whole the app. You can easily change your shared state and read it everywhere.

## Simple counter demo

```javascript
import { box, update } from 'remini';
import { useBox } from 'remini/react';

const $count = box(0)
const inc = () => update($count, c => c + 1)

const Counter = () => {
  const count = useBox($count)
  return <p>
    {count} 
    <button onClick={inc}>➪</button>
  </p>;
};
```

## Perfect frontend with modular architecture.

- No need to wrap the application to Context Provider for each module.
- Import and use, easy code for embedding.

## Modular counter demo

```javascript
// ./counter.shared.js
import { box, wrap, val, put } from 'remini'

export const $count = box(0)
export const $next = wrap(() => val($count) + 1)

export const inc = () => update($count, n => n + 1)
export const reset = () => put($count, 0)
```

```javascript
import { val } from 'remini'
import { component } from 'remini/react'
import { $count, $next, inc, reset } from './counter.shared'

const Counter = component(() => (
  <p>
    {val($count)}
    <button onClick={inc}>➪</button>
    {val($next)}
  </p>
))

const Reset = () => (
  <button onClick={reset}>↻</button>
)

export const App = () => (
  <>
    <Counter />
    <Counter />
    <Reset />
  </>
)
```

[![Edit Counter with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/counter-with-remini-mp2ldi?file=/src/App.js)

And configure [babel jsx wrapper](https://github.com/re-js/babel-plugin-jsx-wrapper) for automatic observation arrow function components if you want.
