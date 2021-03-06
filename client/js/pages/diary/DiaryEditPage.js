
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { getPage } from '../../libs/db';
import { formObject } from '../../libs/utils';
import { fetchPost, saveDiaryPage, UnauthorizedError, NotFoundError } from '../../libs/fetch';

import PageEditor from '../../components/PageEditor';
import LoadingSpinner from '../../components/LoadingSpinner';
import Title from '../../components/Title';
import Flash from '../../components/Flash';


export default class DiaryEditPage extends Component {

	state = {
		post: null,
	};

	constructor(props) {
		super(props);
		
		this.pageId = this.props.matches.pageId;

		// If the post isnt saved, fetch from api
		getPage(this.pageId)
			.then(post => {
				if(!post) throw new Error();
				return post;
			})
			.catch(() =>
				fetchPost(this.pageId)
					.catch(e => {
						let message = 'Something went wrong';

						if(e instanceof NotFoundError) {
							message = 'Post not found.';
							route('/', false);
						} else if(e instanceof UnauthorizedError) {
							message = 'You are not logged in. Log in to continue.';							
						}

						Flash.setFlash(message, 'red');
					})
			)
			.then(post => post? this.setState({ post }): null);

		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	onFormSubmit(e) {
		e.preventDefault();

		const $form = e.currentTarget;
		const data = formObject($form);
		data.ID = this.pageId;

		saveDiaryPage(data);

		return false;
	}

	render() {
		return (
			<div class='center-wrapper'>
				<Title>Edit diary page</Title>

				{
					this.state.post? (
						<div>
							<br />

							<strong style={{ fontWeight: 'bold' }}>
								Edit page
							</strong>

							<br />
							<form onSubmit={this.onFormSubmit}>
								<PageEditor page={this.state.post} />
							</form>
						</div>
					): (
						<LoadingSpinner height='60vh' />
					)
				}
			</div>
		);
	}
}
