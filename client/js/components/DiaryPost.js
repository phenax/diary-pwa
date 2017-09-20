
import {h} from 'preact';

const styles = {
	content: {

	},
	heading: {},
	heading_title: {},
	heading_subtitle: {
		opacity: '.7',
	},
};

export default ({ post }) => (
	<div>
		<h2 class='siimple-h2' style={styles.heading}>
			<div>{post.Title}</div>
			<small style={styles.heading_subtitle} class='siimple-small'>Date goes here</small>
		</h2>

		<p class='siimple-p' style={styles.content}>
			{post.Content}
		</p>
	</div>
);
