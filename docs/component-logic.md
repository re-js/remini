## Logic free React component with Remini

```javascript
// Counter.js
import { read, useLogic, box, update, wrap } from "remini";

const CounterLogic = () => {
  const $value = box(0);
  const inc = () => update($value, n => n + 1);

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
