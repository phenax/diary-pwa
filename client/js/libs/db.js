
import Dexie from 'dexie';

export const DB = new Dexie('diary');

export const DB_VERSION = 1;

// Schema
DB.version(DB_VERSION).stores({
	pages: 'ID, Title, Content, Rating, Timestamp, IsOffline',
});

export const randId = () =>
	(parseInt(Math.round(Math.random()*100000) + ('' + Date.now()))).toString(16);

export const time = () =>
	'' + (Date.now()/1000);



// Save a page
export const savePage = (post) => {

	const {
		ID = `offline-${randId()}`,
		Timestamp = time(),
		IsOffline = false,
		Title, Content, Rating,
	} = post;

	return DB.pages.put({ ID, Title, Content, Rating, Timestamp, IsOffline });
};

// Get a page
export const getPage = (ID) =>
	DB.pages.get(ID);

// Get a list of all saved pages
export const listPages = () =>
	DB.pages
		.reverse()
		.sortBy('Timestamp');

// Get a list of all pages that are not synced
export const listOfflinePages = () =>
	DB.pages
		.where('IsOffline').equals(true)
		.toArray();

