
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


	componentDidMount() {

		const $canvas = this.base;

		this.lock = new PatternLockLib({
			el: $canvas,
			dimens: {
				width: this.props.width || 300,
				height: this.props.height || 430,
			},
		});

		this.lock.setTheme(assign({
			accent: '#905cf0',
			primary: '#ffffff',
			bg: '#252932',
			dimens: {
				node_radius: 20,
				line_width: 6,
				node_core: 8,
				node_ring: 1,
			}
		}, this.props.theme || {}));


		this.lock.generateGrid(this.props.rows || 3, this.props.cols || 3);
		this.lock.start();

		this.lock.onPatternComplete = nodes =>
			this.onPatternComplete(nodes);
	}

	onPatternComplete(nodes) {

		if(nodes.length < 2) {
			this.props.onPatternComplete('');
			return;
		}

		let password = PatternLockLib.patternToWords(nodes);
		password = PatternLockLib.hashCode(password);

		this.props.onPatternComplete(password);
	}

	render() {
		return (<canvas></canvas>);
	}
}
