
import { h, Component } from 'preact';

export default class DiaryPage extends Component {


	render() {
		return (
			<div>
				Diary page ({this.props.matches.pageId})
			</div>
		);
	}
}
