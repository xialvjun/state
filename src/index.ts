import EventEmitter = require('@nodeart/event_emitter');


export class State<S extends Object> extends EventEmitter {
  state: S
  __state_new_state = null
  __state_callbacks = []
  __state_timeout = null
  __updater() {
    this.__state_timeout = null;
    this.state = this.__state_new_state;
    this.__state_new_state = null;
    const cbs = this.__state_callbacks.slice();
    this.__state_callbacks = [];
    cbs.forEach(it => it.call(this));
    this.emit('change', this);
  }
  constructor(initialState?: S) {
    super();
    if (initialState !== undefined) {
      this.state = initialState;
    }
  }
  setState(
    partialState: ((this: this, prevState: Readonly<S>) => (Partial<S> | null)) | (Partial<S> | null),
    callback?: (this: this) => void
  ) {
    callback && this.__state_callbacks.push(callback);
    const current_state = this.__state_new_state || this.state;
    if (typeof partialState === 'function') {
      partialState = partialState.call(this, current_state);
    }
    this.__state_new_state = Object.assign({}, current_state, partialState);
    clearTimeout(this.__state_timeout);
    this.__state_timeout = setTimeout(this.__updater, 0);
  }
  setStateSync(partialState: Partial<S> | null) {
    this.state = Object.assign({}, this.state, partialState);
    this.emit('change', this);
  }
  onChange(handler: (this: this, ...args: any[]) => any) {
    this.on('change', handler);
    return () => this.off('change', handler);
  }
}
