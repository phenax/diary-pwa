
import { h, Component } from 'preact';
import { Promise } from 'es6-promise';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';

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


const asyncComponents = {
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

	state = {
		user: null,
	};

	constructor(props) {
		super(props);

		this.withNavbar = (typeof this.props.withNavbar !== 'undefined')? this.props.withNavbar: true;
	}

	componentDidMount() {

		bus.onAuthChange(user => this.setState({ user }));

		findUser('')
			.then(resp => resp.UserPosts.User)
			.then(user => bus.setAuth(user))
			.catch(e => {
				console.log(e);
				if(e instanceof NotFoundError || e instanceof UnauthorizedError) {
					// TODO: Handle Not logged in
				}
			});
	}

	render() {
		return (
			<div>
				<div style={styles.wrapper}>
					<Flash default />
					{this.withNavbar?
						<Navbar minHeight={VARS.navbarMinHeight}>
							{
								this.state.user?
									(<div>
										<NavLink href="/new">New Page</NavLink>
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
						<AsyncRoute path='/login'
							getComponent={asyncComponents.LoginPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/signup'
							getComponent={asyncComponents.LoginPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId'
							getComponent={asyncComponents.DiaryPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/new'
							getComponent={asyncComponents.DiaryNewPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute path='/page/:pageId/edit'
							getComponent={asyncComponents.DiaryEditPage}
							loading={LoadingSpinner}
						/>
						<AsyncRoute default
							getComponent={asyncComponents.ErrorPage}
							loading={LoadingSpinner}
						/>
					</Router>
				</div>
			</div>
		);
	}
}
