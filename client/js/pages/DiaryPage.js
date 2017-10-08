
import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { fetchPost, UnauthorizedError, NotFoundError } from '../libs/fetch';
import { getPage } from '../libs/db';

import LoadingSpinner from '../components/LoadingSpinner';
import InlineLoadingSpinner from '../components/InlineLoadingSpinner';
import DiaryPost from '../components/DiaryPost';
import Title from '../components/Title';
import Flash from '../components/Flash';

export default class DiaryPage extends Component {

	state = {
		post: null,
		isNotFound: false,
		isSaving: true,
	};

	componentDidMount() {
		const postId = this.props.matches.pageId;
		this.fetchPost(postId);
	}

	fetchPost(postId) {

		this.setState({ isSaving: true });

		fetchPost(postId)
			.then(post => this.setState({ post, isNotFound: false }))
			.catch(e => {
				console.log(e);
				if(e instanceof NotFoundError) {
					this.setState({ isNotFound: true });
				} else if(e instanceof UnauthorizedError) {
					Flash.setFlash('You are not logged in. Log in to continue.', 'red');
				} else {
					getPage(postId)
						.then(post =>
							post?
								this.setState({ post, isNotFound: false }):
								this.setState({ isNotFound: true })
						);
				}
			})
			.then(() =>
				setTimeout(() => this.setState({ isSaving: false }), 1500));
	}

	render() {
		return (
			<div>
				<Title>Read page</Title>
				<div class='center-wrapper'>
					{(() => {

						if(this.state.isNotFound) {   // Page not found error
							return (
								<div>
									<h2 class='siimple-h2'>Page not found</h2>
								</div>
							);
						} else if(this.state.post) {  // The post has been loaded
							return (
								<div>
									<br />
									<div style={{ textAlign: 'right' }}>
										<Link
											class='siimple-btn siimple-btn--navy'
											href={`/page/${this.props.matches.pageId}/edit`}>
											Edit
										</Link>
									</div>
									{this.state.isSaving?
										<div>
											<InlineLoadingSpinner style={{ margin: '0 1em 0 0' }} />
											Saving offline...
										</div>: null
									}
									<DiaryPost post={this.state.post} />
								</div>
							);
						}

						return <LoadingSpinner />;
					})()}
				</div>
			</div>
		);
	}
}
