
import {h} from 'preact';
import { markdown } from 'markdown';

const styles = {
	content: {

	},
	heading: {},
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

export default ({ post }) => (
	<div>
		<h1 class='siimple-h1' style={styles.heading}>
			<div>{post.Title}</div>
			<small style={styles.heading_subtitle} class='siimple-small'>Date goes here</small>
		</h1>

		<p class='siimple-p markdown-content'
			style={styles.content}
			dangerouslySetInnerHTML={{ __html: markdown.toHTML(escapeHtml(post.Content)) }}></p>
	</div>
);
