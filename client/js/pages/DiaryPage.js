
import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { fetchPost, UnauthorizedError, NotFoundError } from '../libs/fetch';

import LoadingSpinner from '../components/LoadingSpinner';
import DiaryPost from '../components/DiaryPost';
import Title from '../components/Title';
import Flash from '../components/Flash';

export default class DiaryPage extends Component {

	state = {
		post: null,
		isNotFound: false,
	};

	componentDidMount() {
		const postId = this.props.matches.pageId;
		this._fetchPost(postId);
	}

	_fetchPost(postId) {
		fetchPost(postId)
			.then(post => this.setState({ post, isNotFound: false }))
			.catch(e => {
				console.log(e);
				if(e instanceof NotFoundError) {
					this.setState({ isNotFound: true });
				} else if(e instanceof UnauthorizedError) {
					Flash.setFlash('You are not logged in. Log in to continue.', 'red');
				}
			});
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
