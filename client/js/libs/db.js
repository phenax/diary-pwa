
import Dexie from 'dexie';

export const DB = new Dexie('diary');

export const DB_VERSION = 1;

// Schema
DB.version(DB_VERSION).stores({
	pages: 'ID, Title, Content, Rating, Timestamp, IsOffline',
	users: 'ID, Name, Username, Email',
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

// Get a page
export const deletePage = (ID) =>
	DB.pages.delete(ID);

// Get a list of all saved pages
export const listPages = () =>
	DB.pages
		.reverse()
		.sortBy('Timestamp');

// Get a list of all pages that are not synced
export const listOfflinePages = () =>
	DB.pages
		.filter(page => page.IsOffline)
		.reverse()
		.sortBy('Timestamp');


// Get the logged in user from the db
export const getUser = () =>
	DB.users
		.filter(user => user.ID.length)
		.first();

// Add a new user/update the current user
export const setUser = user =>
	DB.users.put(user);

// Clear the users info stored from the db
export const removeUsers = () =>
	DB.users
		.filter(user => user.ID.length)
		.delete();
