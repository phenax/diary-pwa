
import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { fetchUserPosts } from '../libs/fetch';

import { Card, CardTitle, CardContent } from '../components/Card';
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
			<div class='center-wrapper'>
				<br />
				<h2 class='siimple-h2'>
					<div>My Diary</div>
				</h2>
				<div style={{ padding: '1em 0' }}>
					{this.state.posts.length === 0?
						<LoadingSpinner />:
						this.state.posts.map(post => (
							<div>
								<Link href={`/page/${post.ID}`} style={{ textDecoration: 'none' }}>
									<Card>
										<CardTitle>{post.Title}</CardTitle>
										<CardContent>{post.Content.slice(0, 100)}{post.Content.length > 100? '...': ''}</CardContent>
									</Card>
								</Link>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}
