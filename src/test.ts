import { State } from "./index";

class AuthState extends State<{ logined: boolean }> {
  state = { logined: false };
  other_property = 123;
  async login(username, password) {
    await Promise.resolve(1);
    this.setState({ logined: true });
  }
}

const auth = new AuthState();

const unsubscribe = auth.onChange(() => {
  console.log(auth.state);
});

auth.login("xialvjun", "password");

const on_other_event = () => {
  console.log("other_evnet", auth.other_property);
};
auth.on("other_event", on_other_event);
auth.other_property = auth.other_property + 1;
auth.emit("other_event");

unsubscribe();


interface Counter<T> extends State<T> {
  inc?(): void;
  dec?(): void;
}
const counter_state = new State({ count: 0 });
const counter = counter_state as Counter<typeof counter_state.state>
counter.inc = () => counter.setState({ count: counter.state.count + 1 });
counter.dec = () => counter.setState({ count: counter.state.count - 1 });
