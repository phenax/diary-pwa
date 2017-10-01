
// @flow

import EventEmitter from 'events';

type User = Object;

export class GlobalEventHandler extends EventEmitter {

	_ON_AUTH_CHANGE = 'ON_AUTH_CHANGE';

	onConnectivityChange(callback: Function): GlobalEventHandler {

		const _onlineStateHandler = e =>
			callback(navigator.onLine, e);

		window.addEventListener('online', _onlineStateHandler);
		window.addEventListener('offline', _onlineStateHandler);

		return this;
	}

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
