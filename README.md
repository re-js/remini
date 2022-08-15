
<div align="center">

# Remini

<img src="https://github.com/re-js/remini/raw/main/logo.png" height="150" alt="Remini" />
  
**Simple** and powerful **state management** in React and Preact
  
[![npm version](https://img.shields.io/npm/v/remini?style=flat-square)](https://www.npmjs.com/package/remini)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/remini?style=flat-square)](https://bundlephobia.com/result?p=remini)
[![code coverage](https://img.shields.io/coveralls/github/re-js/remini?style=flat-square)](https://coveralls.io/github/re-js/remini)
[![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.d.ts)

➪ **Easy** to learn

➪ Small **and quick**

➪ For any scale **apps**

</div>


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


## Multiple stores vs single store

One of the manifestations is the **multiple-store** architecture. The main reason is the independent modules decomposition. For flexible growth, you should separate your code. Your app should be built on top of separated modules composition. There is each module contains some data and logic.

It’s a very good architecture decision because you can develop and test each module separately. You can easily reuse modules between projects. And when you use a lazy load for some parts of your app, you will never have any problem with it, just import it and use it. It should be simple!

Ok. The first one is the **separated module decomposition**, and what's the next?

If each module has its own state and logic it is very convenient to use separate stores to control data flow.

At that moment the good time to make the postulate: **each store should be simple**, and never recommend to make deeply nested state. The better way is following to KISS principle.


## Selection from store

One of the most frequently used functions during work with the state is the selection. Selection is the transformation of your state, fairly for **performance reasons**. You should update your view components only when updated the data used inside. This is the **rendering optimization**.

For example, your user state is big it has a lot of user settings and some stuff. If you have an avatar view component, it should be updated only when the avatar changes, not for each user state update.

```javascript
import { box, select } from 'remini'

const $user = box({
  name: 'Joe',
  email: 'a@x.com',
  settings: {},
  avatar: 'https://avatar.com/1.jpg'
})

const $avatar = select($user, user => user.avatar)
```

```javascript
import { useBox } from 'remini/react'

const Avatar = () => {
  const avatar = useBox($avatar)
  return (
    <img src={avatar} />
  )
}
```

You can see how it’s easy to make that tiny, but very effective optimization!

You don't have to render everything. You should render only what you need! No more, no less)


## Composition of stores

Step by step on the application growing upstairs you will have cases of the necessary combination of multiple stores to one. It should be simple)

```javascript
import { box, read, wrap } from 'remini'

const $firstName = box('John')
const $lastName = box('Doe')

const $fullName = wrap(() => {
  return read($firstName) + ' ' + read($lastName)
})
```

Here we combine several stores into one for convenient use in some view components.


## References

- [The dark mode switcher](./docs/dark-mode.md)
- [Shared state](./docs/shared-state.md)
- [Work together with Redux](./docs/redux.md)
- [Pure reactivity in Node.js](./docs/nodejs.md)


## Install

```bash
npm install remini
# or
yarn add remini
```

Enjoy your code!
