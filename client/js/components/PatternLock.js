
import { h, Component } from 'preact';
import assign from 'object-assign';

import PatternLockLib from '../libs/pattern-lock';

//
// width, height,
// rows, cols,
// theme,
// onPatternComplete,
//
export default class PatternLock extends Component {


	theme = assign({
		accent: '#905cf0',
		primary: '#ffffff',
		bg: '#252932',
		dimens: {
			node_radius: 20,
			line_width: 6,
			node_core: 8,
			node_ring: 1,
		}
	}, this.props.theme || {});

	successTheme = assign({}, this.theme, {
		accent: '#1add9f',
	});

	errorTheme = assign({}, this.theme, {
		accent: '#e60036',
	});




	componentDidMount() {

		const $canvas = this.base;

		this.lock = new PatternLockLib({
			el: $canvas,
			dimens: {
				width: this.props.width || 300,
				height: this.props.height || 430,
			},
		});

		this.lock.setTheme(this.theme);

		this.lock.generateGrid(this.props.rows || 3, this.props.cols || 3);
		this.lock.start();

		this.lock.onPatternComplete = nodes =>
			this.onPatternComplete(nodes);

		this.lock.onSuccess = () => {
			this.lock.setTheme(this.successTheme);
			this.lock.forceRender();
			this.lock.setTheme(this.theme);
		};

		this.lock.onError = () => {
			this.lock.setTheme(this.errorTheme);
			this.lock.forceRender();
			this.lock.setTheme(this.theme);
		};
	}

	onPatternComplete(nodes) {

		if(nodes.length < 2) {
			this.props.onPatternComplete('', this.lock);
			return;
		}

		let password = PatternLockLib.patternToWords(nodes);
		password = PatternLockLib.hashCode(password);

		this.props.onPatternComplete(password, this.lock);
	}

	render() {
		return (<canvas></canvas>);
	}
}
