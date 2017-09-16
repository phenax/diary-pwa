
import { h, Component } from 'preact';
import assign from 'object-assign';


export class Navbar extends Component {

	static styles = {
		navbarWrapper: {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			zIndex: '100',
		},

		navbar: {
			position: 'absolute',
			left: '0',
			top: '0',
			width: '100%',
			minHeight: '50px',
			backgroundColor: '#51e980',
			padding: '.5em 1em',
		},
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={Navbar.styles.navbarWrapper}>
				<div style={assign({}, Navbar.styles.navbar, { minHeight: this.props.minHeight })}>
					Hello
				</div>
			</div>
		);
	}
}
