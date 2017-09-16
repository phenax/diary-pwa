
import { h, render } from 'preact';
import { loadCSS } from 'fg-loadcss';

import RootWrapper from './layouts/RootWrapper';
import HomePage from './layouts/HomePage';



// Load the stylesheet asynchronously
requestAnimationFrame(() => loadCSS(window.staticLink('css/style.css')));



// The component at the root scope
const rootComponent = (
	<RootWrapper>
		<HomePage />
	</RootWrapper>
);

// Render root component to hook
render(rootComponent, document.getElementById('render-hook'));
