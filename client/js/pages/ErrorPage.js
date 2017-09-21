
import { h } from 'preact';

const styles = {
	title: {
		// textAlign: 'center',
	}
};

export default ({ message = 'Page Not Found' }) => (
	<div class='center-wrapper'>
		<br />
		<h2 class='siimple-h2' style={styles.title}>
			{message}
		</h2>
	</div>
);
