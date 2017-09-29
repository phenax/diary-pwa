
import {h} from 'preact';
import { markdown } from 'markdown';
import moment from 'moment';

const styles = {
	content: {

	},
	heading: {
		padding: '1em 0',
	},
	heading_title: {},
	heading_subtitle: {
		opacity: '.7',
	},
};

const escapeHtml = html => {
	const $text = document.createTextNode(html);
	const $div = document.createElement('div');
	$div.appendChild($text);
	return $div.innerHTML;
};

const time = (timestamp) => {
	const TIME_FORMAT = 'MMMM D, YYYY. hh:mm A';
	const date = moment(parseInt(timestamp)*1000);
	return date.format(TIME_FORMAT);
};

export default ({ post }) => (
	<div>
		<h1 class='siimple-h1' style={styles.heading}>
			<div>{post.Title}</div>
			<small style={styles.heading_subtitle} class='siimple-small'>{time(post.Timestamp)}</small>
		</h1>

		<p class='siimple-p markdown-content'
			style={styles.content}
			dangerouslySetInnerHTML={{ __html: markdown.toHTML(escapeHtml(post.Content)) }}></p>
	</div>
);
