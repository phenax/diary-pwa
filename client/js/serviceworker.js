
import sw from 'sw-toolbox';

const BASE_URL = self.STATIC_BASE_URL;
const SCRIPT_CACHE_NAME = `diary-cache-js--${self.STATIC_CACHE_VERSION}`;
const CSS_CACHE_NAME = `diary-cache-css--${self.STATIC_CACHE_VERSION}`;
const IMG_CACHE_NAME = `diary-cache-images--${self.STATIC_CACHE_VERSION}`;

const NETWORK_TIMEOUT = 5;


const precacheFiles = [
	'js/1.1.js',
	'js/2.2.js',
	'js/3.3.js',
	'js/4.4.js',
	'js/5.5.js',
].map(file => BASE_URL + file);


sw.precache(precacheFiles);

sw.router.get(/\.js$/, sw.fastest, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: {
		name: SCRIPT_CACHE_NAME,
	},
});

sw.router.get(/\.(css|woff|woff2|ttf)$/, sw.cacheFirst, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: {
		name: CSS_CACHE_NAME,
	},
});

sw.router.get(/\.(png|ico|jpg)$/, sw.cacheFirst, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: {
		name: IMG_CACHE_NAME,
	},
});



