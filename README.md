# create-react-context
An EventEmitter which is stateful and has `setState` method which can debounce `change` event. Like Flux.

## Install
`npm i @xialvjun/state` or `yarn add @xialvjun/state`

## Example

```jsx
import { State } from '@xialvjun/state';

class AuthState extends State<{ logined: boolean }> {
  state = { logined: false }
  other_property = 123
  async login(username, password) {
    await Promise.resolve(1);
    this.setState({ logined: true });
  }
}

const auth = new AuthState();

const unsubscribe = auth.onChange(() => {
  console.log(auth.state);
});

auth.login('xialvjun', 'password');

const on_other_event = () => {
  console.log('other_evnet', auth.other_property);
}
auth.on('other_event', on_other_event);
auth.other_property = auth.other_property + 1;
auth.emit('other_event');

unsubscribe();
```
