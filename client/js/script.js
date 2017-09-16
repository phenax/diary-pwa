
import { h, render } from 'preact';
import { loadCSS } from 'fg-loadcss';

import RootWrapper from './pages/RootWrapper';


// Load the stylesheet asynchronously
requestAnimationFrame(() => loadCSS(window.staticLink('css/style.css')));

// Render root component to hook
render(<RootWrapper />, document.getElementById('render-hook'));
