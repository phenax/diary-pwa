
import { h, Component } from 'preact';
import { fetchPost } from '../libs/fetch';

import LoadingSpinner from '../components/LoadingSpinner';
import DiaryPost from '../components/DiaryPost';

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

		let $renderEl = <LoadingSpinner />;

		if(this.state.isNotFound)
			$renderEl = <div>Not found soory bruh</div>;
		if(this.state.post)
			$renderEl = <DiaryPost post={this.state.post} />;

		return (
			<div>
				<div class='center-wrapper'>
					{$renderEl}
				</div>
			</div>
		);
	}
}
