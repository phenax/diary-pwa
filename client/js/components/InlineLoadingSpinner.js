
import { h } from 'preact';
import assign from 'object-assign';

export default ({ style, color = '#fff', hide=false }) => (
	<span
		class='inline-spinner'
		style={assign(
			{
				'borderLeftColor': color,
				'display': hide? 'none': 'inline-block',
			},
			style
		)}
	/>
);
