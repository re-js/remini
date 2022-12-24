# Work together with Redux

It's easy! You can simply create Remini reactive variable from Redux store, and use it everywhere you want!

```javascript
// ./remini-store.js
import { box, set } from 'remini'
import { store } from './redux-store'

export const $store = box(store.getState())

store.subscribe(() => {
  set($store, store.getState())
})
```

And you can make cached selectors for performance optimization reasons.

```javascript
// ./remini-selectors.js
import { get, wrap } from 'remini'
import { $store } from './remini-store'

export const $user = wrap(() => get($store).user)

export const $fullName = wrap(
  () => `${get($user).firstName} ${get($user).lastName}`
);
```

And use it everywhere.

```javascript
import { useBox } from 'remini/react'
import { $fullName } from './remini-selectors'

export const UserInfo = () => {
  const fullName = useBox($fullName)

  return <p>{fullName}</p>
}
```

As you can see, everything is quite simple and can be effectively used together!

[![Edit Redux with Remini](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/redux-with-remini-ou9v4e?file=/src/components/UserInfo.js)
