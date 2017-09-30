
import { h, Component } from 'preact';

import { saveDiaryPage } from '../libs/fetch';
import { formObject } from '../libs/utils';

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
		const data = formObject($form);

		saveDiaryPage(data);

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
