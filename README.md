# Remini

[![npm version](https://img.shields.io/npm/v/remini?style=flat-square)](https://www.npmjs.com/package/remini) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/remini?style=flat-square)](https://bundlephobia.com/result?p=remini) [![code coverage](https://img.shields.io/coveralls/github/betula/remini?style=flat-square)](https://coveralls.io/github/betula/remini) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.d.ts)

## Global state management with React

- Easy to learn
- Small and quick
- From tiny to complex apps

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



## The dark mode switcher

A good example of a shared state benefit is the Dark mode switcher. Because you should get access to user choice in a big set of React components, it is very inconvenient to use props passing pattern.

What is necessary to implement:

- Provide convenient functions for changing user choices.
- Provide access to user choice around the app code.
- Keep user choice across browser sessions.

Will clearly demonstrate how to create, use and propagate a shared state.

Each shared state is stored in a special place created by calling the `box` function. This will be a reactive variable, which means we will be able to update all places where it is used when it changes.

We will keep the dark mode enabled state in this way.

To update the value of a reactive variable, we will use the `update` function. That takes the dark mode reactive variable as the first argument and the updater function as the second one. The updater function receives the current state in the first argument and returned the new state of dark mode.

```javascript
// ./dark-mode.shared.js
import { box, update } from 'remini'

// create new reactive variable with "false" by default
export const $darkMode = box(false)

// create a function that should change dark mode to opposite each time calling
export const toggleDarkMode = () => {
  update($darkMode, (enabled) => !enabled)
}
```

Now we can read and subscribe to dark mode changes everywhere we need.

For easy binding to the React components, the `useBox` hook function is used. It allows you to get the value of the reactive variable, as well as automatically update the React component when the value changes.

```javascript
import { useBox } from 'remini'
import { $darkMode, toggleDarkMode } from './dark-mode.shared'

export const DarkModeButton = () => {
  const darkMode = useBox($darkMode)

  return (
    <button onClick={toggleDarkMode}>
      Switch to {darkMode ? 'light' : 'dark'} mode
    </button>
  )
}
```

Excellent! Now you can easily derive dark mode state to any React component using the same way. This is very simple, you should get state of the dark mode using the `useBox` hook, and it's all that you need. Each time when dark mode state will be changed, and all components using it will be updated automatically.

And finally, we should make some code updates, because we almost forget to save user choice to browser local storage, to keep persistent between browser sessions.

For accessing storage we will use the "localStorage" browser API. We will call "getItem" to retrieve the saved state, and call "setItem" to save it.

```javascript
// import { write, on } from 'remini'

// get choice from previous browser session
write($darkMode, localStorage.getItem('darkMode') === 'on')

// update user choice in browser local storage each time then it changed
on($darkMode, (enabled) => {
  localStorage.setItem('darkMode', enabled ? 'on' : 'off')
})
```

The last operation in this example call of `on` function. It means that we subscribe to changes in dark mode reactive variable, and react on them each time changes for saving state to browser persistence storage.

Brilliant! Now you can use it everywhere you want, it's worked well and should provide benefits for your users!

[![Edit DarkMode module with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/darkmode-module-with-remini-5updlc?file=/src/App.js)

It's looking good and provides you with convenient opportunities for controlling your shared state, and deriving in any parts of your application. You can create as many reactive variables as you want, it's quick and useful!



## References

- [Why?](./docs/why.md)
- [Shared state](./docs/shared-state.md)
- [Work together with Redux](./docs/redux.md)
- [Pure reactivity with Node.js](./docs/nodejs.md)


```bash
npm install remini
# or
yarn add remini
```

Enjoy your code!
