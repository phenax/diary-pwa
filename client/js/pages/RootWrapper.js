
import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Link, Match } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';
import assign from 'object-assign';

import { findUser, logoutUser, NotFoundError, UnauthorizedError } from '../libs/fetch';
import bus from '../libs/listeners';

import HomePage from './HomePage';

import { Navbar } from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Flash from '../components/Flash';


const VARS = {
	navbarMinHeight: '60px',
};

const styles = {
	wrapper: {
		marginTop: VARS.navbarMinHeight,
	},
};


export const NavLink = ({ children, href, action }) =>
	action?
		<a class='siimple-btn'
			onClick={action}>
			{children}
		</a>:
		<Link
			class="siimple-btn"
			activeClassName="siimple-color--purple"
			href={href}>
			{children}
		</Link>;

export default class RootWrapper extends Component {


	asyncComponents = {
		LoginPage: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./LoginPage').default))),
		DiaryPage: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./DiaryPage').default))),
		DiaryNewPage: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./DiaryNewPage').default))),
		DiaryEditPage: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./DiaryEditPage').default))),
		ErrorPage: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./ErrorPage').default))),
		OfflinePosts: () => new Promise((resolve) =>
			require.ensure([], () => resolve(require('./OfflinePosts').default))),
	};


	state = {
		user: null,
	};

	constructor(props) {
		super(props);

		this.withNavbar = (typeof this.props.withNavbar !== 'undefined')? this.props.withNavbar: true;

		this.onRouteChange = this.onRouteChange.bind(this);
	}

	componentDidMount() {

		bus.onAuthChange(user => this.setState({ user }));

		findUser()
			.then(resp => resp.UserPosts.User)
			.then(user => bus.setAuth(user));



		let onlineTimeout = null;

		bus.onConnectivityChange((isOnline) => {

			const FLASH_MESSAGE = 'You are offline';
			const DELAY = 2000; // Wait 2000ms before declaring the network state

			clearTimeout(onlineTimeout);

			onlineTimeout = setTimeout(() => {
				if(!isOnline) {
					Flash.setFlash(FLASH_MESSAGE, 'red', 'white');
				} else {
					Flash.closeFlash();
				}
			}, DELAY);
		});


		this.$navbarLinks = document.querySelector('.js-navbar-links-wrapper');
	}

	hideNavbar() {
		if(this.$navbarLinks && this.$navbarLinks.classList.contains('navbar-links__visible')) {
			this.$navbarLinks.classList.remove('navbar-links__visible');
		}
	}

	onRouteChange() {
		this.hideNavbar();
	}

	render() {
		return (
			<div>
				<div style={styles.wrapper}>
					<Flash default />
					<Match default>{this.onRouteChange}</Match>
					{this.withNavbar?
						<Navbar minHeight={VARS.navbarMinHeight}>
							{
								this.state.user?
									(<div>
										<NavLink href="/new">New Page</NavLink>
										<NavLink href="/offline">Offline Drafts</NavLink>
										<NavLink href='/'>{this.state.user.Username}</NavLink>
										<NavLink action={logoutUser}>Logout</NavLink>
									</div>):
									(<div>
										<NavLink href="/login">Login</NavLink>
										<NavLink href="/signup">Signup</NavLink>
									</div>)
							}
						</Navbar>:
						null}
					<Router>
						<HomePage path='/' />
						<AsyncRoute path='/offline'
							getComponent={this.asyncComponents.OfflinePosts}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/login'
							getComponent={this.asyncComponents.LoginPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/signup'
							getComponent={this.asyncComponents.LoginPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId'
							getComponent={this.asyncComponents.DiaryPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/new'
							getComponent={this.asyncComponents.DiaryNewPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId/edit'
							getComponent={this.asyncComponents.DiaryEditPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute default
							getComponent={this.asyncComponents.ErrorPage}
							loading={LoadingSpinner}
						/>
					</Router>
				</div>
			</div>
		);
	}
}
