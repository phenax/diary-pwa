
import { h, Component } from 'preact';
import { fetchPost } from '../libs/fetch';
import { Link } from 'preact-router/match';

import LoadingSpinner from '../components/LoadingSpinner';
import DiaryPost from '../components/DiaryPost';
import Title from '../components/Title';

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
			.then(post =>
				post?
					this.setState({ post, isNotFound: false }):
					this.setState({ isNotFound: true })
			);
	}


	render() {
		return (
			<div>
				<Title>Read page</Title>
				<div class='center-wrapper'>
					{(() => {

						if(this.state.isNotFound) {   // Page not found error
							return (
								<div>Not found soory bruh</div>
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
