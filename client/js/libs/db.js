
import EventEmitter from 'events';

import { timestamp, randId } from '../libs/utils';
import { DB_VERSION } from '../config/app';


const LOAD_EVENT_NAME = 'DexieLoaded';
let DB = null;

const eventBus = new EventEmitter();

require.ensure([], () => {

	const Dexie = require('dexie');

	DB = new Dexie('diary');

	// Schema
	DB.version(DB_VERSION).stores({
		pages: 'ID, Title, Content, Rating, Timestamp, IsOffline',
		users: 'ID, Name, Username, Email',
	});

	eventBus.emit(LOAD_EVENT_NAME, DB);
});


export const onDBLoad = (callback) => {

	return new Promise((resolve, reject) => {

		const _cb = () => callback().then(resolve).catch(reject);

		if(!DB) {
			eventBus.on(LOAD_EVENT_NAME, () => _cb());
		} else {
			_cb();
		}
	});
};



// Save a page
export const savePage = (post) => {

	const {
		ID = `offline-${randId()}`,
		Timestamp = timestamp(),
		IsOffline = false,
		Title, Content, Rating,
	} = post;

	return onDBLoad(() =>
		DB.pages.put({ ID, Title, Content, Rating, Timestamp, IsOffline })
	);
};

// Get a page
export const getPage = (ID) =>
	onDBLoad(() => DB.pages.get(ID));

// Get a page
export const deletePage = (ID) =>
	onDBLoad(() => DB.pages.delete(ID));

// Clear the posts stored in the db
export const removeAllPosts = () =>
	onDBLoad(() =>
		DB.users
			.filter(post => post.ID.length)
			.delete()
	);


// Get a list of all saved pages
export const listPages = () =>
	onDBLoad(() =>
		DB.pages
			.reverse()
			.sortBy('Timestamp')
	);

// Get a list of all pages that are not synced
export const listOfflinePages = () =>
	onDBLoad(() =>
		DB.pages
			.filter(page => page.IsOffline)
			.reverse()
			.sortBy('Timestamp')
	);

// Get the logged in user from the db
export const getUser = () =>
	onDBLoad(() =>
		DB.users
			.filter(user => user.ID.length)
			.first()
	);

// Add a new user/update the current user
export const setUser = user =>
	onDBLoad(() => DB.users.put(user));

// Clear the users info stored from the db
export const removeUsers = () =>
	onDBLoad(() =>
		DB.users
			.filter(user => user.ID.length)
			.delete()
	);
