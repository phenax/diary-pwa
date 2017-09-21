
import {h, Component} from 'preact';

import PageEditor from '../components/PageEditor';

export default class DiaryEditPage extends Component {

	render() {
		return (
			<div class='center-wrapper'>

				<strong class='siimple-strong'>Number</strong>

				<PageEditor />
			</div>
		);
	}
}
