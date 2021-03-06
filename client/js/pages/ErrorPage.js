
import { h } from 'preact';

import Title from '../components/Title';

const styles = {
	title: {
		// textAlign: 'center',
	}
};

export default ({ message = 'Page Not Found' }) => (
	<div class='center-wrapper'>
		<Title>{message}</Title>
		<br />
		<h2 class='siimple-h2' style={styles.title}>
			{message}
		</h2>
	</div>
);
