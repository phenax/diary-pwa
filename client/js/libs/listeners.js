
// @flow

import EventEmitter from 'events';

type User = Object;


// Subscription - 
export class Subscription {

	unsubscribe: Function = () => null;
	eventNames: Array<string> = [];

	constructor(...eventNames: Array<string>) {
		this.eventNames = eventNames;
	}

	setUnsubscribeCallback(callback: Function): Subscription {
		this.unsubscribe = callback;
		return this;
	}
}


export class GlobalEventHandler extends EventEmitter {

	_ON_AUTH_CHANGE = 'ON_AUTH_CHANGE';

	onConnectivityChange(callback: Function): Subscription {

		const _onlineStateHandler = e =>
			callback(navigator.onLine, e);

		window.addEventListener('online', _onlineStateHandler);
		window.addEventListener('offline', _onlineStateHandler);

		return (new Subscription('online', 'offline')).setUnsubscribeCallback(() => {
			window.removeEventListener('online', _onlineStateHandler);
			window.removeEventListener('offline', _onlineStateHandler);
		});
	}

	onAuthChange(callback: Function): Subscription {

		this.on(this._ON_AUTH_CHANGE, callback);

		return (new Subscription(this._ON_AUTH_CHANGE)).setUnsubscribeCallback(() =>
			this.removeListener(this._ON_AUTH_CHANGE, callback));
	}

	setAuth(user: User): GlobalEventHandler {
		this.emit(this._ON_AUTH_CHANGE, user);
		return this;
	}
}

export default new GlobalEventHandler();
