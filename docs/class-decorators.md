# Class decorators for TRFP

Transparent Functional Reactive Programming.

`prop` - reactive value marker decorator. Each reactive value has an immutable state. If the immutable state will update, all who depend on It will refresh.

```javascript
class Todos {
  @prop items = [];

  constructor() {
    on(() => this.items, () => console.log('items changed'));
  }

  add(todo: string) {
    this.items = this.items.concat(todo); // an immutable modification
  }
}
```

`cache` - is the decorator for define selector on class getter.

```javascript
class Todos {
  @prop items = [];

  @cache get completed() {
    return this.items.filter(item => item.completed);
  }
}
```

You can configure [babel jsx wrapper](https://github.com/betula/babel-plugin-jsx-wrapper) for automatic observation arrow function components if you want.
