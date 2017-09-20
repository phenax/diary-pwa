
import { h, Component } from 'preact';
import { fetchUserPosts } from '../libs/fetch';

import LoadingSpinner from '../components/LoadingSpinner';

export default class DiaryPage extends Component {

	state = {
		posts: [],
		pageNumber: 0,
	};

	componentDidMount() {
		// const postId = this.props.matches.pageId;

		this.maxPosts = this.props.numberOfPostsPerPage;

		this._fetchPosts();
	}

	_fetchPosts() {

		const page = this.state.pageNumber;
		const variables = {
			count: this.maxPosts || 10,
			start: page? (page - 1) * this.maxPosts: -1,
		};

		fetchUserPosts(variables)
			.then(p => p.Posts)
			.then(posts => {

				if(this.props.isInfiniteScroll) {
					posts = this.state.posts.concat(posts);
				}

				this.setState({ posts });
			});
	}


	render() {
		return (
			<div>
				Diary page ({this.props.matches.pageId})
				<div>
					{this.state.posts.length === 0?
						<LoadingSpinner />:
						this.state.posts.map(post => (
							<div>
								<div>{post.Title}</div>
								<div>{post.Content}</div>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}
