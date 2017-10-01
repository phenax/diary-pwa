
import { h, Component } from 'preact';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';


import listeners from '../libs/listeners';
import { listOfflinePages, deletePage }  from '../libs/db';
import { saveDiaryPage } from '../libs/fetch';

import { Card, CardTitle, CardContent } from '../components/Card';
import Title from '../components/Title';

export default class OfflinePosts extends Component {

	state = {
		posts: [],
		isOnline: false,
		isLoading: false,
	};

	constructor(props) {
		super(props);

		this.syncPosts = this.syncPosts.bind(this);
	}

	componentDidMount() {
		listeners.onConnectivityChange((isOnline) => {
			this.setState({ isOnline });
		});

		this.listOfflinePosts();
	}

	listOfflinePosts() {
		listOfflinePages()
			.then(posts => this.setState({ posts }));
	}

	syncPosts() {

		this.setState({ isLoading: true });

		listOfflinePages()
			.then(posts => posts.map(post => {

				const postID = post.ID;

				delete post.IsOffline;
				if(/^offline-/gi.test(post.ID)) {
					delete post.ID;
				}

				return { post, ID: postID };
			}))
			.then(posts => posts.map(post =>
				saveDiaryPage(post.post, true)
					.then(newPost => { newPost.OldID = post.ID; return newPost; })))
			.then(posts => Promise.all(posts))
			.then(posts => posts.map(post => {
				if(post && post.OldID) {
					deletePage(post.OldID);
				}
			}))
			.then(() => this.setState({ isLoading: false }))
			.then(() => route('/', false));
	}

	render() {
		return (
			<div>
				<Title>Read page</Title>
				<div class='center-wrapper'>
					<div>
						<h2 class='siimple-h2'>
							<div>Unsaved drafts</div>
							<small class='siimple-small'>Offline posts that need to be synced to the server</small>
						</h2>
						<div style={{ padding: '1.5em 0' }}>
							{
								this.state.posts.length === 0?
									(<div><em>You have no unsaved drafts.</em></div>):
									<div>
										<div style={{ textAlign: 'right', padding: '.5em 0 1.5em' }}>
											<button
												onClick={this.syncPosts}
												class='siimple-btn siimple-btn--purple'>
												{this.state.isLoading? <i class='fa fa-spinner fa-spin' />: null}
												<span style={{ paddingRight: '.5em' }} />
												Sync with server
											</button>
										</div>
										<div>
											{
												this.state.posts.map(post => (
													<div>
														<Link href={`/page/${post.ID}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', }}>
															<Card isAction={true} cardClass='siimple-bg--navy'>
																<CardTitle>{post.Title}</CardTitle>
																<CardContent>{post.Content.slice(0, 150)}{post.Content.length > 150? '...': ''}</CardContent>
															</Card>
														</Link>
														<br />
													</div>
												))
											}
										</div>
									</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
