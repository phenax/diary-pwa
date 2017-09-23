
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { saveDiaryPage } from '../libs/fetch';

import PageEditor from '../components/PageEditor';
import Title from '../components/Title';

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
			.then(resp => {
				if(resp.Status == 200) {
					// TODO: Add some kind of flash to notify user that its saved
					route('/', false);
				} else {
					// TODO: HAndle this more elegantly
					alert(resp.Message);
				}
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
