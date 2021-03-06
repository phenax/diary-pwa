
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
import PatternLock from '../components/PatternLock';


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
			require.ensure([], () => resolve((p) => h(require('./user/LoginPage').default, assign(p, props))))),
		UserEditPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./user/UserEditPage').default, assign(p, props))))),
		DiaryPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./diary/DiaryPage').default, assign(p, props))))),
		DiaryNewPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./diary/DiaryNewPage').default, assign(p, props))))),
		DiaryEditPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./diary/DiaryEditPage').default, assign(p, props))))),
		ErrorPage: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./ErrorPage').default, assign(p, props))))),
		OfflinePosts: (props = {}) => () => new Promise((resolve) =>
			require.ensure([], () => resolve((p) => h(require('./diary/OfflinePosts').default, assign(p, props))))),
	};

	state = {
		user: null,
		isLocked: false,
	};

	onlineSubscription = {};
	authChangeSubscription = {};

	constructor(props) {
		super(props);

		this.withNavbar = (typeof this.props.withNavbar !== 'undefined')? this.props.withNavbar: true;

		this.onRouteChange = this.onRouteChange.bind(this);
		this.onPatternComplete = this.onPatternComplete.bind(this);
	}


	initPatternLock() {
		this.setState({ isLocked: true });
	}

	onPatternComplete(password, locker) {
		if(password === this.state.user.SessionPassword) {
			locker.onSuccess();
			setTimeout(() =>
				this.setState({ isLocked: false }), 300);
		} else {
			locker.onError();
		}
	}


	componentDidMount() {

		this.$navbarLinks = document.querySelector('.js-navbar-links-wrapper');
		this.$navbarBtnIcon = this.base.querySelector('.js-navbar-btn-icon');

		this.authChangeSubscription =
			bus.onAuthChange(user => {
				this.setState({ user: user? user: {} });

				// Initiate password lock
				if(user && user.SessionPassword) {
					this.initPatternLock();
				}
			});

		this.getLoggedInUser();

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
	}

	componentWillUnmount() {
		this.onlineSubscription.unsubscribe();
		this.authChangeSubscription.unsubscribe();
	}

	getLoggedInUser() {
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
	}

	authenticateOffline() {
		return getUser().then(user => {
			bus.setAuth(user);
			return user;
		});
	}

	hideNavbar() {
		if(this.$navbarLinks && this.$navbarLinks.classList.contains('navbar-links__visible')) {
			this.$navbarLinks.classList.remove('navbar-links__visible');
			this.$navbarBtnIcon.classList.remove('icon-ham__cross');
		}
	}

	onRouteChange() {
		this.hideNavbar();
	}

	render() {

		let $component = (<div>
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
				<AsyncRoute path='/edit-profile'
					getComponent={this.asyncComponents.UserEditPage({ user: this.state.user })}
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
		</div>);

		if(this.state.isLocked) {
			$component = <div style={{ textAlign: 'center' }}>
				<PatternLock onPatternComplete={this.onPatternComplete} />
			</div>;
		}

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
											<NavLink href='/edit-profile'>Edit profile</NavLink>
											<NavLink action={logoutUser}>Logout</NavLink>
										</div>:
										<div>
											<NavLink href="/login">Login</NavLink>
											<NavLink href="/signup">Signup</NavLink>
										</div>):
									null
							}
						</Navbar>: null
					}
					{$component}
				</div>
			</div>
		);
	}
}
