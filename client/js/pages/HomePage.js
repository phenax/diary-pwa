
import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { fetchUserPosts, UnauthorizedError } from '../libs/fetch';

import { Card, CardTitle, CardContent } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Title from '../components/Title';

export default class HomePage extends Component {

	state = {
		posts: [],
		pageNumber: 0,
		isLoaded: false,
		isLoggedIn: true,
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
			.then(({ Posts }) =>  // Infinite scroll
				this.props.isInfiniteScroll? this.state.posts.concat(Posts): Posts)
			.then(posts =>        // Update component state
				this.setState({ posts, pageNumber: page, isLoggedIn: true, isLoaded: true }))
			.catch(error => {
				console.error(error);
				if(error instanceof UnauthorizedError) {
					this.setState({ isLoggedIn: false, isLoaded: true });
				}
			});
	}


	render() {

		let $component = <LoadingSpinner height={'60vh'} />;

		// If the posts was loaded
		if(this.state.isLoaded) {
			if(this.state.isLoggedIn) {
				$component = (
					<div>
						<Title>My Diary</Title>
						<h2 class='siimple-h2'>
							<div>My Diary</div>
						</h2>
						<div style={{ padding: '1.5em 0' }}>
							{this.state.posts.length === 0?
								(<div><em>No posts found</em></div>):
								this.state.posts.map(post => (
									<div>
										<Link href={`/page/${post.ID}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', }}>
											<Card isAction={true} cardClass='siimple-bg--navy'>
												<CardTitle>{post.Title}</CardTitle>
												<CardContent>{post.Content.slice(0, 100)}{post.Content.length > 100? '...': ''}</CardContent>
											</Card>
										</Link>
										<br />
									</div>
								))
							}
						</div>
					</div>
				);
			} else {
				$component = (
					<div>
						<Title>You need to login bro</Title>
						<h2 class='siimple-h2'>
							Not logged in. Login to continue
						</h2>
					</div>
				);
			}
		}


		return (
			<div class='center-wrapper'>
				<Title>Welcome</Title>
				<br />
				{$component}
			</div>
		);
	}
}
