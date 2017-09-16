
import { h } from 'preact';

import { Navbar } from '../components/Navbar';



const VARS = {
	navbarMinHeight: '50px',
};

const styles = {
	wrapper: {
		marginTop: VARS.navbarMinHeight,
	},
};


export default ({ children, withNavbar = true }) => (
	<div>
		<div style={styles.wrapper}>
			{withNavbar? <Navbar minHeight={VARS.navbarMinHeight} />: null}
			{children}
		</div>
	</div>
);
