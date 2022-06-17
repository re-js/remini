# Remini

[![npm version](https://img.shields.io/npm/v/remini?style=flat-square)](https://www.npmjs.com/package/remini) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/remini?style=flat-square)](https://bundlephobia.com/result?p=remini) [![code coverage](https://img.shields.io/coveralls/github/betula/remini?style=flat-square)](https://coveralls.io/github/betula/remini) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.d.ts)

## Simple and powerful state management in React

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

[![Edit Simple and powerful state management with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/simple-and-powerful-state-management-with-remini-7ejjhd?file=/src/App.js)

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


## Why Remini?

Your coding time saver!

Minimal, well structured, and flexible codebase save a lot of developer time for maintain and grouth your React applications.

How it works

Usually when you just start React project or have a very small one, your codebase is short, undestable and simple, you can easily google examples of common issues.

But as you write the business logic of your application, the code gets larger and it becomes more and more difficult to understand the abundance of files, tricks and code pieces.

You should clear understand where is a place to your logic, how you can write as many code as you want without reduce your application maintance.

- How to make a simple React application who can easily upscale to large application by business demand
- How to organize your code clean with minimal states and convinient separated logic
- How to speed up your application and reduce boilerplate

My answer is **Remini** 😍


## References

- [The dark mode switcher](./docs/dark-mode.md)
- [Shared state](./docs/shared-state.md)
- [Work together with Redux](./docs/redux.md)
- [Pure reactivity in Node.js](./docs/nodejs.md)
- [Component logic with Remini](./docs/component-logic.md)

```bash
npm install remini
# or
yarn add remini
```

Enjoy your code!
