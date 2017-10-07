
import { h, Component } from 'preact';
import { EventEmitter } from 'events';

import { APP_NAME } from '../config/app';

import * as icons from '../libs/icons';


export default class Flash extends Component {

	static get STORAGE_KEY() { return `${APP_NAME}--flash`; }

	static styles = {
		wrapper: {
			position: 'fixed',
			left: 0,
			bottom: 0,
			width: '100%',
			padding: '1em',
			zIndex: '99',
		},
		closeBtn: {
			position: 'absolute',
			right: 0,
			top: 0,
			backgroundColor: 'transparent',
			border: 'none',
			outline: 'none',
		},
	};

	static flashListener = new EventEmitter();

	static getFlash() {
		let flash = window.localStorage.getItem(Flash.STORAGE_KEY);
		flash = flash? JSON.parse(flash): null;
		return flash;
	}

	static setFlash(message, color = 'navy', textColor = '#fff') {
		const flash = JSON.stringify({ message, color, textColor });
		window.localStorage.setItem(Flash.STORAGE_KEY, flash);
		Flash.flashListener.emit('flash');
	}

	static unsetFlash() {
		window.localStorage.setItem(Flash.STORAGE_KEY, '');
	}

	static closeFlash() {
		Flash.flashListener.emit('flash-close');
	}


	state = {
		flash: null,
	};

	constructor(props) {
		super(props);

		this.closeFlash = this.closeFlash.bind(this);

		Flash.flashListener.on('flash', () => {
			const flash = Flash.getFlash();
			this.setState({ flash });
			setTimeout(() => Flash.unsetFlash(), 100);
		});

		Flash.flashListener.on('flash-close', () => {
			this.closeFlash();
			Flash.unsetFlash();
		});

		Flash.flashListener.emit('flash');
	}

	closeFlash() {
		this.setState({ flash: null });
	}

	render() {

		if(!this.state.flash)
			return null;

		return (
			<div
				style={Flash.styles.wrapper}
				class={`siimple-shadow--2 slide-in siimple-color--${this.state.flash.textColor} siimple-bg--${this.state.flash.color}`}>
				<button class='siimple-btn' style={Flash.styles.closeBtn} onClick={this.closeFlash}>{icons.CROSS}</button>
				<div style={{ textAlign: 'center' }}>
					{this.state.flash.message}
				</div>
			</div>
		);
	}
}



