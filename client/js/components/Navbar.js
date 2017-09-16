
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
			padding: '.5em 1em',
		},

		logo: {
			fontWeight: 'lighter',
			fontSize: '1.3em',
			color: '#fff',
		},
	};

	render() {

		const navbarStyles = assign({}, Navbar.styles.navbar, { minHeight: this.props.minHeight || '50px' });

		return (
			<div style={Navbar.styles.navbarWrapper}>
				<div class='vertical-center siimple-bg--navy siimple-shadow--2' style={navbarStyles}>
					<div style={Navbar.styles.logo}>
						<span class='siimple-color--pink' style={{ fontWeight: 'bold' }}>A</span><span>Diary</span>
					</div>
				</div>
			</div>
		);
	}
}
