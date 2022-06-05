# Shared state with Remini

The key to winning is the shared state and logic. Pure React doesn't have a convenient way to organize shared states that can be used whole the application. 

Suggested React ways are passing state by props thought nesting components from parent to child, and using Context for giving shared access to some state values in children components. Both ways can't share state with any part of your app!

Architecture with a shared state provides more simplest code. You can control your state and logic in separate files that can be accessed whole the app. You can easily change your shared state and read it everywhere.

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
