
import {h, Component} from 'preact';

import PageEditor from '../components/PageEditor';
import Title from '../components/Title';

export default class DiaryEditPage extends Component {

	render() {
		return (
			<div class='center-wrapper'>
				<Title>Edit diary page</Title>

				<strong class='siimple-strong'>Number</strong>

				<PageEditor />
			</div>
		);
	}
}
