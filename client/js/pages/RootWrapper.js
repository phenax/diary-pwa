
import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import { Link, Match } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';
import assign from 'object-assign';

import { findUser, logoutUser, UnauthorizedError } from '../libs/fetch';
import bus from '../libs/listeners';
import { getUser, setUser } from '../libs/db';
import * as icons from '../libs/icons';

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
		LoginPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./LoginPage').default, assign(p, props))))),
		DiaryPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./DiaryPage').default, assign(p, props))))),
		DiaryNewPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./DiaryNewPage').default, assign(p, props))))),
		DiaryEditPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./DiaryEditPage').default, assign(p, props))))),
		ErrorPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./ErrorPage').default, assign(p, props))))),
		OfflinePosts: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./OfflinePosts').default, assign(p, props))))),
	};

	state = {
		user: null,
	};

	onlineSubscription = {};
	authChangeSubscription = {};

	constructor(props) {
		super(props);

		this.withNavbar = (typeof this.props.withNavbar !== 'undefined')? this.props.withNavbar: true;

		this.onRouteChange = this.onRouteChange.bind(this);
		this.logoutUser = this.logoutUser.bind(this);
	}


	authenticateOffline() {
		return getUser().then(user => {
			bus.setAuth(user);
			return user;
		});
	}

	componentDidMount() {

		this.authChangeSubscription =
			bus.onAuthChange(user =>
				this.setState({ user: user? user: {} }));

		// Fetch users
		findUser()
			.then(resp => resp.UserPosts.User)
			.then(user => {
				bus.setAuth(user);
				setUser(user);
			})
			.catch(e => {
				if(e instanceof UnauthorizedError) {
					bus.setAuth(null);
				} else {
					this.authenticateOffline();
				}
			});


		let onlineTimeout = null;

		this.onlineSubscription = bus.onConnectivityChange((isOnline) => {

			const FLASH_MESSAGE = 'You are offline';
			const DELAY = 2000; // Wait 2s before declaring the network state

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

	componentWillUnmount() {
		this.onlineSubscription.unsubscribe();
		this.authChangeSubscription.unsubscribe();
	}


	hideNavbar() {
		if(this.$navbarLinks && this.$navbarLinks.classList.contains('navbar-links__visible')) {
			this.$navbarLinks.classList.remove('navbar-links__visible');
		}
	}

	onRouteChange() {
		this.hideNavbar();
	}

	logoutUser() {
		logoutUser();

		// Force reload page
		route('/logout', false);
		route('/', false);
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
									(this.state.user.ID?
										<div>
											<NavLink href="/new">New Page</NavLink>
											<NavLink href="/offline">Offline Drafts</NavLink>
											<NavLink href='/'>{this.state.user.Username}</NavLink>
											<NavLink action={this.logoutUser}>Logout</NavLink>
										</div>:
										<div>
											<NavLink href="/login">Login</NavLink>
											<NavLink href="/signup">Signup</NavLink>
										</div>):
									null
							}
						</Navbar>:
						null}
					<Router>
						<HomePage path='/' user={this.state.user} />
						<AsyncRoute path='/offline'
							getComponent={this.asyncComponents.OfflinePosts({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/login'
							getComponent={this.asyncComponents.LoginPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/signup'
							getComponent={this.asyncComponents.LoginPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId'
							getComponent={this.asyncComponents.DiaryPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/new'
							getComponent={this.asyncComponents.DiaryNewPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId/edit'
							getComponent={this.asyncComponents.DiaryEditPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
						<AsyncRoute default
							getComponent={this.asyncComponents.ErrorPage({ user: this.state.user })}
							loading={LoadingSpinner}
						/>
					</Router>

					<div>
						{
							(this.state.user && this.state.user.ID)?
								(<button
									role='button' aria-label='Create new post button'
									title='Create new post button'
									onClick={() => route('/new', false)}
									class='floating-action-button'>
									{icons.PLUS}
								</button>): null
						}
					</div>
				</div>
			</div>
		);
	}
}
