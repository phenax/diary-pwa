
import { h, Component } from 'preact';
import { fetchUserPosts } from '../libs/fetch';

export default class DiaryPage extends Component {

	componentDidMount() {
		const postId = this.props.matches.pageId;

		fetchUserPosts()
			.then(resp => console.log(resp));
	}


	render() {
		return (
			<div>
				Diary page ({})
			</div>
		);
	}
}
