
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


const $renderHook = document.getElementById('render-hook');

// Empty the div
while($renderHook.firstChild) {
	$renderHook.removeChild($renderHook.firstChild);
}

// Render root component to hook
render(<RootWrapper />, $renderHook);


// Service worker registrations
if('serviceWorker' in window.navigator) {
	window.navigator.serviceWorker
		.register('/sw.js')
		.then(console.log)
		.catch(console.error);
}

