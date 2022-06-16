# Pure reactivity in Node.js

```javascript
import { box, read, write, update, wrap, on } from 'remini'

const $value = box(0)
const $next = wrap(() => read($value) + 1)

on($value, n => console.log('The current value:', n))

update($value, n => n + 1)  // The current value: 1
write($value, 2)            // The current value: 2

console.log(read($next))    // 3
```
