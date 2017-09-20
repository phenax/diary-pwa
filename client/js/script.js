
import { h, render } from 'preact';
import { loadCSS } from 'fg-loadcss';

import RootWrapper from './pages/RootWrapper';


// Load the stylesheets asynchronously
const stylesheets = [
	window.staticLink('css/style.css'),
	'https://fonts.googleapis.com/css?family=Montserrat:400,700',
];

stylesheets.map(href =>
	requestAnimationFrame(() => loadCSS(href)));


// Render root component to hook
render(<RootWrapper />, document.getElementById('render-hook'));
