
import { h } from 'preact';
import assign from 'object-assign';

const styles = {

	wrapper: {
		position: 'relative',
	},
};

export default ({ height = 100 } = {}) => (
	<div style={assign({ height }, styles.wrapper)}>
		<div class='spinner spinner__center' />
	</div>
);
