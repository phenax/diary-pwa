
import { h, render } from 'preact';

import RootWrapper from './layouts/RootWrapper';
import HomePage from './layouts/HomePage';

render(
	(
		<RootWrapper>
			<HomePage />
		</RootWrapper>
	),
	document.getElementById('render-hook')
);

// import ModuleLazyLoader from './components/ModuleLazyLoader';
// const Loadd = () => <div>Loading...</div>;

// const onComponentLoad = cb =>
// 	require.ensure([], () => {
// 		const HomePage = require('./layouts/HomePage').default;
// 		cb(<HomePage />);
// 	});

// render(
// 	<ModuleLazyLoader onComponentLoad={onComponentLoad} loader={<Loadd />} />,
// 	document.getElementById('render-hook')
// );
