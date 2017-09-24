
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { saveDiaryPage, UnauthorizedError } from '../libs/fetch';

import PageEditor from '../components/PageEditor';
import Title from '../components/Title';
import Flash from '../components/Flash';

export default class DiaryNewPage extends Component {

	constructor(props) {
		super(props);
		
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	onFormSubmit(e) {
		e.preventDefault();

		const $form = e.currentTarget;
		// TODO: Formdata polyfill
		const data =
			Array.from((new FormData($form)).entries())
				.reduce((obj, el) => { obj[el[0]] = el[1]; return obj; }, {});

		saveDiaryPage(data)
			.then(resp => resp.NewPost)
			.then(data => {
				switch(data.Status) {
					case 200: // Take the user to dashboard // TODO: Add some kind of flash to notify user that its saved
						return route('/', false);
					case 400:
						throw new Error(data.Message);
					case 401:
						throw new UnauthorizedError(data.Message, []);
					default:
						throw new Error(data.Message);
				}
			})
			.catch(e => {

				let errorMessage = 'Something went wrong';

				if(e instanceof UnauthorizedError) {
					errorMessage = 'You are not logged in. Please log in to continue.';
				}

				Flash.setFlash(errorMessage, 'red', 'white');
			});

		return false;
	}

	render() {
		return (
			<div class='center-wrapper'>
				<Title>Add a new page</Title>

				<br />

				<strong style={{ fontWeight: 'bold' }}>
					New page in your diary
				</strong>

				<br />

				<form onSubmit={this.onFormSubmit}>
					<PageEditor post={null} />
				</form>
			</div>
		);
	}
}
