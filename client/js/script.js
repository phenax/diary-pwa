
import { h, render } from 'preact';
import { loadCSS } from 'fg-loadcss';

// Load it in the first script so that the other chunks are smaller
import './libs/db';

import RootWrapper from './pages/RootWrapper';


// Load the stylesheets asynchronously
const stylesheets = [
	window.staticLink('css/style.css'),
	'https://fonts.googleapis.com/css?family=Montserrat:400,700',
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css',
];

stylesheets.map(href =>
	requestAnimationFrame(() => loadCSS(href)));


const $renderHook = document.getElementById('render-hook');

// Empty div
while($renderHook.firstChild) {
	$renderHook.removeChild($renderHook.firstChild);
}

// Render root component to hook
render(<RootWrapper />, $renderHook);
