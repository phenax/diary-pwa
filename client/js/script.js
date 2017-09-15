
import { h, render } from 'preact';

const Loadd = () => <div>Loading...</div>;

render(
	Loadd,
	document.getElementById('render-hook')
);

setTimeout(() => {

	require.ensure([ './layouts/HomePage' ], () => {

		const HomePage = require('./layouts/HomePage').default;

		render(
			<HomePage />,
			document.getElementById('render-hook')
		);
	});
}, 10000);

