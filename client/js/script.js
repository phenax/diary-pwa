
import { h, render } from 'preact';

import ModuleLazyLoader from './components/ModuleLazyLoader';


const Loadd = () => <div>Loading...</div>;

const onComponentLoad = cb =>
	require.ensure([], () => cb(require('./layouts/HomePage').default));

render(
	<ModuleLazyLoader onComponentLoad={onComponentLoad} loader={Loadd} />,
	document.getElementById('render-hook')
);
