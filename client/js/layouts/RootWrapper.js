
import { h } from 'preact';

import { Navbar } from '../components/Navbar';

const styles = {

	wrapper: {
		padding: '1em',
		border: '2px solid red',
	},
};

export default ({ children, withNavbar = true }) => (
	<div>
		<div style={styles.wrapper}>
			{withNavbar? <Navbar />: null}
			{children}
		</div>
	</div>
);
