# Remini

[![npm version](https://img.shields.io/npm/v/remini?style=flat-square)](https://www.npmjs.com/package/remini) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/remini?style=flat-square)](https://bundlephobia.com/result?p=remini) [![code coverage](https://img.shields.io/coveralls/github/betula/remini?style=flat-square)](https://coveralls.io/github/betula/remini) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.d.ts)

## Global state management with React

- Easy to learn
- Small and quick
- From tiny to complex apps

<!--
- Small and fast|nimble|concise
-->

<!--
The key to winning is the shared state and logic. Pure React doesn't have a convenient way to organize shared states that can be used whole the application. 

Suggested React ways are passing state by props thought nesting components from parent to child, and using Context for giving shared access to some state values in children components. Both ways can't share state with any part of your app!

Architecture with a shared state provides more simplest code. You can control your state and logic in separate files that can be accessed whole the app. You can easily change your shared state and read it everywhere.
-->

## Get started

At first you have a **state** 😊

```javascript
const $user = box({ email: 'a@x.com' })
const $enabled = box(true)
const $counter = box(42)
const $books = box([ 'The Little Prince', 'Alice in Wonderland' ])
```

At second **bind state to React** component!

```javascript
const Books = () => {
  const books = useBox($books)
  return <ul>
    {books.map(book => <li>{book}</li>)}
  </ul>
}
```

At third **update the state** 👍

```javascript
const BookForm = () => {
  const [name, setName] = React.useState('')

  return <p>
    <input 
      value={name}
      onChange={event => setName(event.target.value)} 
      />
    <button
      onClick={() => update($books, books => [...books, name])}
      >Add</button>
  </p>
}
```

At fourth **share your logic** 😉

```javascript
// ./books.shared.js
export const $books = box([])
export const $loading = box(false)

export const load = async () => {
  write($loading, true)

  const response = await fetch('https://example.com/api/books')
  const books = await response.json()

  write($books, books)
  write($loading, false)
}
```

```javascript
const BooksLoad = () => {
  const loading = useBox($loading)
  
  return <p>
    {loading ? 'Loading...' : (
      <button onClick={load}>Load</button>
    )}
  </p>
}
```

<!--
## Simple counter demo

```javascript
import { box, update, useBox } from 'remini';

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
-->

<!-- Perfect code-splitting, pretty and minimalistic syntax, well structured and maintainable codebase. -->

<!--
Your coding time saver!

Minimal, well structured, and flexible codebase save a lot of developer time for maintain and grouth your React applications.

How it works

Usually when you just start React project or have a very small one, your codebase is short, undestable and simple, you can easily google examples of common issues.

But as you write the business logic of your application, the code gets larger and it becomes more and more difficult to understand the abundance of files, tricks and code pieces.

You should clear understand where is a place to your logic, how you can write as many code as you want without reduce your application maintance.

- How to make a simple React application who can easily upscale to large application by business demand
- How to organize your code clean with minimal React components and convinient separated logic
- How to speed up your application and reduce boilerplate

## Tiny frontend with modular architecture.

-->




## The dark mode switcher

A good example of a shared state benefit is the Dark mode switcher. Because you should get access to user choice in a big set of React components, it is very inconvenient to use props passing pattern.

What is necessary to implement:

- Provide convenient functions for changing user choices.
- Provide access to user choice around the app code.
- Keep user choice across browser sessions.

Will clearly demonstrate how to create, use and propagate a shared state.

Each shared state is stored in a special place created by calling the "box" function. This will be a reactive variable, which means we will be able to update all places where it is used when it changes.

We will keep the dark mode enabled state in this way.

To update the value of a reactive variable, we will use the "update" function. That takes the dark mode reactive variable as the first argument and the updater function as the second one. The updater function receives the current state in the first argument and returned the new state of dark mode.

```javascript
// dark-mode.shared.js
import { box, update } from "remini"

// create new reactive variable with "false" by default
export const $darkMode = box(false)

// create a function that should change dark mode to opposite each time calling
export const toggleDarkMode = () => {
  update($darkMode, (enabled) => !enabled)
}
```

Now we can read and subscribe to dark mode changes everywhere we need.

For easy binding to the React components, the "useBox" hook function is used. It allows you to get the value of the reactive variable, as well as automatically update the React component when the value changes.

```javascript
import { useBox } from "remini"
import { $darkMode, toggleDarkMode } from "./dark-mode.shared"

export const DarkModeButton = () => {
  const darkMode = useBox($darkMode)

  return (
    <button onClick={toggleDarkMode}>
      Switch to {darkMode ? "light" : "dark"} mode
    </button>
  )
}
```

Excellent! Now you can easily derive dark mode state to any React component using the same way. This is very simple, you should get state of the dark mode using the "useBox" hook, and it's all that you need. Each time when dark mode state will be changed, and all components using it will be updated automatically.

And finally, we should make some code updates, because we almost forget to save user choice to browser local storage, to keep persistent between browser sessions.

For accessing storage we will use the "localStorage" browser API. We will call "getItem" to retrieve the saved state, and call "setItem" to save it.

```javascript
// import { write, on } from "remini"

// get choice from previous browser session when reactive variable create
write($darkMode, localStorage.getItem("darkMode") === "on")

// update user choice in browser local storage each time then it changed
on($darkMode, (enabled) => {
  localStorage.setItem("darkMode", enabled ? "on" : "off")
})
```

The last operation in this example call of "on" function. It means that we subscribe to changes in dark mode reactive variable, and react on them each time changes for saving state to browser persistence storage.

Brilliant! Now you can use it everywhere you want, it's worked well and should provide benefits for your users!

<!--

[![Edit DarkMode module with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/darkmode-module-with-remini-5updlc?file=/src/App.js)

-->

It's looking good and provides you with convenient opportunities for controlling your shared state, and deriving in any parts of your application. You can create as many reactive variables as you want, it's quick and useful!


<!--

## Work together with Redux

It's easy! You can simply create Remini reactive variable from Redux store, and use it everywhere you want!

```javascript
// ./remini-store.js
import { re, write } from "remini"
import { store } from "./redux-store"

export const $store = re(store.getState())

store.subscribe(() => {
  write($store, store.getState())
})
```

And you can make cached selectors for performance optimization reasons.

```javascript
// ./remini-selectors.js
import { select } from "remini"
import { $store } from "./remini-store"

export const $user = select($store, (state) => state.user)

export const $fullName = select(
  $user,
  (user) => `${user.firstName} ${user.lastName}`
)
```

And use it everywhere.

```javascript
import { useRe } from "remini"
import { $fullName } from "./remini-selectors"

export const UserInfo = () => {
  const fullName = useRe($fullName)

  return <p>{fullName}</p>
}
```

As you can see, everything is quite simple and can be effectively used together!

[![Edit Redux with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/redux-with-remini-ou9v4e?file=/src/components/UserInfo.js)

-->

<!--
## Modularity

Perfect frontend with modular architecture.

- No need to wrap the application to Context Provider for each module.
- Import and use, easy code for embedding.
- Created just when it is used, by demand, that increases in performance.


<!--
## Perfect frontend with modular architecture.

- No need to wrap the application to Context Provider for each module.
- Import and use, easy code for embedding.
- Created just when it is used, by demand, that increases in performance.

```javascript
// counter.shared.js
import { re, wrap, read, write, shared } from "remini"

const Counter = () => {
  const $value = re(0)
  const $next = wrap(() => read($value) + 1)

  const inc = () => update($value, n => n + 1)
  const reset = () => write($value, 0)

  return { $value, $next, inc, reset }
}

export const sharedCounter = () => shared(Counter)
```

```javascript
import { observe, read } from "remini"
import { sharedCounter } from "./counter.shared"

const Counter = observe(() => {
  const { $value, $next, inc } = sharedCounter()

  return <p>
    {read($value)}
    <button onClick={inc}>➪</button>
    {read($next)}
  </p>
})

const Reset = () => {
  const { reset } = sharedCounter()
  return <button onClick={reset}>↻</button>
}

export const App = () => (
  <>
    <Counter />
    <Counter />
    <Reset />
  </>
)
```

[![Edit Counter with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/counter-with-remini-mp2ldi?file=/src/App.js)


## Clear React components and convenient separated logic

```javascript
// Counter.js
import { read, useLogic, re, update, wrap } from "remini";

const CounterLogic = () => {
  const $value = re(0);
  const inc = () => update($value, (n) => n + 1);

  return wrap(() => ({
    value: read($value),
    inc
  }));
};

export const Counter = () => {
  const { value, inc } = useLogic(CounterLogic);

  return (
    <p>
      {value}
      <button onClick={inc}>➪</button>
    </p>
  );
};
```

[![Edit Logic free React component with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/logic-free-react-component-with-remini-4bklxc?file=/src/Counter.js)

-->

<!--

## Work together with Redux

## Simple unit testing

-->

<!--
**Pure reactivity**

```javascript
import { re, read, write, update, wrap, on } from "remini"

const $value = re(0)
const $next = wrap(() => read($value) + 1)

on($value, n => console.log('The current value:', n))

update($value, n => n + 1)  // The current value: 1
write($value, 2)            // The current value: 2

console.log(read($next))    // 3
```
-->


## References

- [Why?]()
- [Work together with Redux]()
- [Pure reactivity on Node.js]()



Enjoy your code!

<!-- - [The dark mode switcher]() -->

<!-- - [Perfect frontend with modular architecture]() -->

<!-- - [Simple unit testing]() -->
