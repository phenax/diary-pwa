
import { h } from 'preact';
import { Router, Link } from 'preact-router';

import { Navbar } from '../components/Navbar';
import HomePage from './HomePage';
import DiaryPage from './DiaryPage';


const VARS = {
	navbarMinHeight: '50px',
};

const styles = {
	wrapper: {
		marginTop: VARS.navbarMinHeight,
	},
};


export default ({ withNavbar = true }) => (
	<div>
		<div style={styles.wrapper}>
			{withNavbar?
				<Navbar minHeight={VARS.navbarMinHeight}>
					<Link class="siimple-btn siimple-btn--grey" activeClassName="siimple-btn--pink" href="/">Home</Link>
					<Link class="siimple-btn siimple-btn--grey" activeClassName="siimple-btn--pink" href="/page/hello">Goto DiaryPage</Link>
				</Navbar>:
				null}
			<Router>
				<HomePage path='/' />
				<DiaryPage path='/page/:pageId' />
			</Router>
		</div>
	</div>
);
