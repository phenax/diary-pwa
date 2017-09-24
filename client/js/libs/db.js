
import Dexie from 'dexie';

export const DB = new Dexie('diary');

// Schema
DB.version(1).stores({
	pages: 'ID,Title,Content, Rating',
});

// Save a page
export const savePage = ({ ID, Title, Content, Rating }) =>
	DB.pages.put({ ID, Title, Content, Rating });

// Get a page
export const getPage = ID =>
	DB.pages.get(ID);

