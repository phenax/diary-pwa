
import { h } from 'preact';
import { Link } from 'preact-router/match';

import Title from '../components/Title';


const styles = {

	masthead: {
		padding: '4em 1em',
		backgroundColor: 'rgba(0, 0, 0, .05)',
	},

	heading: {
		padding: '0 0 .3em',
		lineHeight: '.53em',
		width: '100%',
	},
};

export default () => (
	<div>
		<Title>Welcome to Diary PWA</Title>

		<div style={styles.masthead}>

			<div class='center-wrapper'>
				<h2 class='siimple-h2' style={styles.heading}>
					<div style={{ paddingBottom: '.5em' }}>
						<span style={{ fontWeight: 'lighter' }}>Diary</span>
						<span class='siimple-color--purple'>PWA</span>
					</div>
					<small class='siimple-small' style={{ opacity: '.8', lineHeight: '0', textTransform: 'uppercase', }}>
						Your diary in your pocket<br />
						Keep your thoughts and ideas of the day in one place. 
					</small>
				</h2>
				<div>
					<Link href='/login' class='siimple-btn siimple-btn--white siimple-btn--long'>Login</Link>
					<Link href='/signup' class='siimple-btn siimple-btn--teal siimple-btn--long'>Signup</Link>
				</div>
			</div>
		</div>
	</div>
);
