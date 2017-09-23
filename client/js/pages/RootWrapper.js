
import { h } from 'preact';
import { Promise } from 'es6-promise';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';

import HomePage from './HomePage';
import { Navbar } from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';


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


export const NavLink = ({ children, href }) =>
	<Link
		class="siimple-btn siimple-color--grey"
		activeClassName="siimple-btn--pink"
		href={href}>
		{children}
	</Link>;

export default ({ withNavbar = true }) => (
	<div>
		<div style={styles.wrapper}>
			{withNavbar?
				<Navbar minHeight={VARS.navbarMinHeight}>
					<NavLink href="/">Home</NavLink>
					<NavLink href="/new">New Page</NavLink>
					<NavLink href="/login">Login</NavLink>
					<NavLink href="/signup">Signup</NavLink>
					<NavLink href="/notfound">Not Found</NavLink>
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
