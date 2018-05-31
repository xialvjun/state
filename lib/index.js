"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("@nodeart/event_emitter");
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State(initialState) {
        var _this = _super.call(this) || this;
        _this.__state_new_state = null;
        _this.__state_callbacks = [];
        _this.__state_timeout = null;
        if (initialState !== undefined) {
            _this.state = initialState;
        }
        return _this;
    }
    State.prototype.__updater = function () {
        var _this = this;
        this.__state_timeout = null;
        this.state = this.__state_new_state;
        this.__state_new_state = null;
        var cbs = this.__state_callbacks.slice();
        this.__state_callbacks = [];
        cbs.forEach(function (it) { return it.call(_this); });
        this.emit("change", this);
    };
    State.prototype.setState = function (partialState, callback) {
        callback && this.__state_callbacks.push(callback);
        var current_state = this.__state_new_state || this.state;
        if (typeof partialState === "function") {
            partialState = partialState.call(this, current_state);
        }
        this.__state_new_state = Object.assign({}, current_state, partialState);
        clearTimeout(this.__state_timeout);
        this.__state_timeout = setTimeout(this.__updater, 0);
    };
    State.prototype.setStateSync = function (partialState) {
        this.state = Object.assign({}, this.state, partialState);
        this.emit("change", this);
    };
    State.prototype.onChange = function (handler) {
        var _this = this;
        this.on("change", handler);
        return function () { return _this.off("change", handler); };
    };
    return State;
}(event_emitter_1.EventEmitter));
exports.State = State;
