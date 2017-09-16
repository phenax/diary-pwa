
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
			padding: '.5em 1em',
		},
	};

	constructor(props) {
		super(props);
	}

	render() {

		const navbarStyles = assign({}, Navbar.styles.navbar, { minHeight: this.props.minHeight });

		return (
			<div style={Navbar.styles.navbarWrapper}>
				<div class='siimple-bg--navy siimple-color--grey' style={navbarStyles}>
					<strong>Diarya</strong>
				</div>
			</div>
		);
	}
}
