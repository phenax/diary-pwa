
import {h} from 'preact';

const styles = {
	cardWrapper: {
		padding: '.5em 0',
	},
	card: {
		padding: '.3em 1em',
	},
	card_content: {
		color: '#888',
	},
};

export const Card = ({ children, isAction = false }) => (
	<div style={styles.cardWrapper} class={`${isAction? 'card-shadow card-shadow__hover': 'siimple-shadow--1'}`}>
		<div style={styles.card}>
			{children}
		</div>
	</div>
);

export const CardTitle = ({ children, subtitle = '' }) => (
	<div>
		<h3 class='siimple-h3'>
			<div>{children}</div>
			{subtitle.length?
				<small class='siimple-small' style={{ opacity: '.7' }}>{subtitle}</small>:
				null}
		</h3>
	</div>
);

export const CardContent = ({ children }) => (
	<div style={styles.card_content}>
		<p class='siimple-p'>
			{children}
		</p>
	</div>
);
