
import { h, Component } from 'preact';
import { fetchUserPosts } from '../libs/fetch';
import { Link } from 'preact-router/match';

import LoadingSpinner from '../components/LoadingSpinner';

export default class HomePage extends Component {

	state = {
		posts: [],
		pageNumber: 0,
	};

	MAX_POSTS = this.props.numberOfPostsPerPage;

	constructor(props) {
		super(props);

		this.fetchPosts = this.fetchPosts.bind(this);
	}

	componentDidMount() {
		this.fetchPosts();
	}

	fetchPosts(page=-1) {

		const options = {
			count: this.MAX_POSTS || 10,
			start: page? (page - 1) * this.MAX_POSTS: -1,
		};

		fetchUserPosts(options)
			.then(p => {

				let posts = p.Posts;

				if(this.props.isInfiniteScroll) {
					posts = this.state.posts.concat(posts);
				}

				this.setState({ posts, pageNumber: page });
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
								<Link href={`/page/${post.ID}`}>
									{post.Title}
								</Link>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}
