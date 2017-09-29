
import Dexie from 'dexie';

export const DB = new Dexie('diary');

export const DB_VERSION = 1;

// Schema
DB.version(DB_VERSION).stores({
	pages: 'ID, Title, Content, Rating',
});

// Save a page
export const savePage = (post) =>
	DB.pages.put(post);

// Get a page
export const getPage = (ID) =>
	DB.pages.get(ID);


// export const saveLogin = (data) => {
	
// };
