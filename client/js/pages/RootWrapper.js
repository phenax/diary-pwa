
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
			{withNavbar? <Navbar minHeight={VARS.navbarMinHeight} />: null}
			<Router>
				<HomePage path='/' />
				<DiaryPage path='/page/:pageId' />
			</Router>

			<div>
				<Link activeClassName="active" href="/">Home</Link><br />
				<Link activeClassName="active" href="/page/hello">Goto DiaryPage</Link>
			</div>
		</div>
	</div>
);
