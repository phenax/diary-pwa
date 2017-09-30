
// @flow

import EventEmitter from 'events';

type User = Object;

export class GlobalEventHandler extends EventEmitter {

	_ON_AUTH_CHANGE = 'ON_AUTH_CHANGE';

	onAuthChange(callback: Function): GlobalEventHandler {
		this.on(this._ON_AUTH_CHANGE, callback);
		return this;
	}

	setAuth(user: User): GlobalEventHandler {
		this.emit(this._ON_AUTH_CHANGE, user);
		return this;
	}
}

export default new GlobalEventHandler();
