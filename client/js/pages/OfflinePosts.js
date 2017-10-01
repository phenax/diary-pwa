
import { h, Component } from 'preact';

import listeners from '../libs/listeners';

import Title from '../components/Title';

export class OfflinePosts extends Component {

	state = {
		posts: [],
		isOnline: false,
	};

	constructor(props) {
		super(props);

		this.syncPosts = this.syncPosts.bind(this);
	}

	componentDidMount() {
		listeners.onConnectivityChange((isOnline) => {
			this.setState({ isOnline });
		});
	}

	listOfflinePosts() {

	}

	syncPosts() {

	}

	render() {
		return (
			<div>
				<Title>Read page</Title>
				<div class='center-wrapper'>
					<div>
						<h2 class='siimple-h2'>
							<div>Offline posts</div>
						</h2>
						<div style={{ padding: '1.5em 0' }}>
							{
								this.state.posts.length !== 0 && this.state.isOnline?
									<button
										onClick={this.syncPosts}
										class='siimple-btn'>
										Sync with server
									</button>: null
							}
							{
								this.state.posts.length === 0?
									(<div><em>Looks like you don't have any posts. <Link href='/new'>Create one now!</Link></em></div>):
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
				</div>
			</div>
		);
	}
}
