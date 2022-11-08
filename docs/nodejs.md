# Pure reactivity in Node.js

```javascript
import { box, val, put, update, wrap, on } from 'remini'

const $value = box(0)
const $next = wrap(() => val($value) + 1)

on($next, n => console.log('Next value: ' + n))

update($value, n => n + 1)  // Next value: 2
put($value, 2)            // Next value: 3

console.log(val($next))    // 3
```

[![Try it on RunKit](https://badge.runkitcdn.com/>.svg)](https://runkit.com/betula/62ac2287cdb97e00080fc9d5)
