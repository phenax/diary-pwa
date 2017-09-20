
import { h } from 'preact';
import {Promise} from 'es6-promise';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';

import HomePage from './HomePage';
import { Navbar } from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';


const VARS = {
	navbarMinHeight: '50px',
};

const styles = {
	wrapper: {
		marginTop: VARS.navbarMinHeight,
	},
};


const asyncComponents = {
	DiaryPage: () => new Promise((resolve) =>
		require.ensure([], () => resolve(require('./DiaryPage').default))),
	ErrorPage: () => new Promise((resolve) =>
		require.ensure([], () => resolve(require('./ErrorPage').default))),
};


export default ({ withNavbar = true }) => (
	<div>
		<div style={styles.wrapper}>
			{withNavbar?
				<Navbar minHeight={VARS.navbarMinHeight}>
					<Link class="siimple-btn siimple-color--grey" activeClassName="siimple-btn--pink" href="/">Home</Link>
					<Link class="siimple-btn siimple-color--grey" activeClassName="siimple-btn--pink" href="/notfound">Not Found</Link>
				</Navbar>:
				null}
			<Router>
				<HomePage path='/' />
				<AsyncRoute path='/page/:pageId'
					getComponent={asyncComponents.DiaryPage}
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
