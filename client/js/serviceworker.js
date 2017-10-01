
import sw from 'sw-toolbox';

const BASE_URL = self.STATIC_BASE_URL;
const SCRIPT_CACHE_NAME = `diary-cache-js--${self.STATIC_CACHE_VERSION}`;
const CSS_CACHE_NAME = `diary-cache-css--${self.STATIC_CACHE_VERSION}`;
const OTHER_CACHE_NAME = `diary-cache-images--${self.STATIC_CACHE_VERSION}`;

const NETWORK_TIMEOUT = 5;


const precacheFiles = [
	'js/1.1.js',
	'js/2.2.js',
	'js/3.3.js',
	'js/4.4.js',
	'js/5.5.js',
].map(file => BASE_URL + file);
sw.precache(precacheFiles);




// Scripts will be cached here
sw.router.get(/\.js(\?(.*))?$/, sw.fastest, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: { name: SCRIPT_CACHE_NAME },
});

// CSS extension files will be cached here
sw.router.get(/\.css(\?(.*))?$/, sw.cacheFirst, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: { name: CSS_CACHE_NAME },
});

// Google fonts css and font files will be cached here
sw.router.get(/(fonts\.gstatic\.com|fonts\.googleapis\.com)/, sw.cacheFirst, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: { name: CSS_CACHE_NAME },
});

// Other(images) files will be cached here
sw.router.get(/\.(png|ico|jpg)$/, sw.cacheFirst, {
	networkTimeoutSeconds: NETWORK_TIMEOUT,
	cache: { name: OTHER_CACHE_NAME },
});



