
import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
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

		navbar_logo: {
			fontWeight: 'lighter',
			fontSize: '1.3em',
			color: '#fff',
		},
	};

	constructor(props) {
		super(props);

		this.navbarToggle = this.navbarToggle.bind(this);
		this.hideNavbar = this.hideNavbar.bind(this);
		this.showNavbar = this.showNavbar.bind(this);
	}

	componentDidMount() {
		this.$navbarLinks = this.base.querySelector('.js-navbar-links-wrapper');
	}

	showNavbar() { this.$navbarLinks.classList.add('navbar-links__visible'); }
	hideNavbar() { this.$navbarLinks.classList.remove('navbar-links__visible'); }

	navbarToggle() {

		if(this.$navbarLinks && this.$navbarLinks.classList.contains('navbar-links__visible')) {
			this.hideNavbar();
		} else {
			this.showNavbar();
		}
	}

	render() {

		const navbarStyles = assign({}, Navbar.styles.navbar, { minHeight: this.props.minHeight || '50px' });

		return (
			<div style={Navbar.styles.navbarWrapper}>
				<div class='vertical-center siimple-bg--navy siimple-shadow--2' style={navbarStyles}>
					<div style={Navbar.styles.navbar_logo}>
						<Link href='/' style={{ color: 'inherit', textDecoration: 'none' }}>
							<span style={{ fontWeight: 'lighter' }}>Diary</span><span class='siimple-color--purple' style={{ fontWeight: 'bold' }}>PWA</span>
						</Link>
					</div>

					<div style={{ textAlign: 'right', width: '100%' }}>
						<button
							role="button" aria-label="Navigation menu button"
							class='siimple-btn navbar-links-action'
							onClick={this.navbarToggle}>
							<span class='icon-ham'>
								<span class='icon-ham--bar' />
								<span class='icon-ham--bar' />
								<span class='icon-ham--bar' />
							</span>
						</button>
					</div>

					<div
						style={Navbar.styles.navbar_links}
						class='navbar-links js-navbar-links-wrapper siimple-color--grey'>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
