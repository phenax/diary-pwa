
import { route } from 'preact-router';

import { API_ENDPOINT } from '../config/graphql';

import { listPosts, getPost, savePost } from '../queries/posts';
import { login, findUser as findUserQuery, signup, logout } from '../queries/users';

import { Extendable } from '../libs/utils';
import bus from '../libs/listeners';
import { savePage, removeUsers } from '../libs/db';

import Flash from '../components/Flash';


// Unauthorized exception
export class UnauthorizedError extends Extendable(Error) {
	isUnauthorizedError = true;
	name = 'UnauthorizedError';
	errors = [];

	constructor(message, errors) {
		super(message);
		if(errors) this.errors = errors;
	}
}

// Unauthorized exception
export class NotFoundError extends Extendable(Error) {
	isNotFoundError = true;
	name = 'NotFoundError';
	errors = [];

	constructor(message, errors) {
		super(message);
		if(errors) this.errors = errors;
	}
}

// Fetch the graphql api with the passed query
const graphQLFetch = query => {

	const config = {
		method: 'POST',
		body: JSON.stringify(query),
		headers: {
			'Accept': 'applications/json',
			'Content-Type': 'applications/json',
		},
		credentials: 'same-origin',
	};

	return fetch(API_ENDPOINT, config)
		.then(resp => resp.json())
		.then(resp => {
			if(resp.errors && resp.errors.length) {
				switch(resp.errors[0].message) {
					case 'Unauthorized':
						throw new UnauthorizedError(resp.errors[0].message, resp.errors);
					case 'NotFound':
						throw new NotFoundError(resp.errors[0].message, resp.errors);
					default: {
						const e = new Error(resp.errors[0].message);
						e.errors = resp.errors;
						throw e;
					}
				}
			}

			return resp.data;
		});
};
export default graphQLFetch;


// Fetch user along with their posts(logged in user only)
export const fetchUserPosts = vars =>
	graphQLFetch(listPosts(vars))
		.then(resp => resp.UserPosts);

// Get single post(passing the id)
export const fetchPost = pageId =>
	graphQLFetch(getPost(pageId))
		.then(resp => resp.Post)
		.then(post => {
			if(!post)
				throw new NotFoundError('Post not found');
			return post;
		})
		.then(post => {
			savePage(post);
			return post;
		});


// Login a user
export const loginUser = (username, password) =>
	graphQLFetch(login({ username, password }));

export const findUser = username =>
	graphQLFetch(findUserQuery({ username }));


export const createUser = data =>
	graphQLFetch(signup(data))
		.then(resp => resp.CreateUser);

export const logoutUser = () =>
	graphQLFetch(logout())
		.then(() => bus.setAuth(null))
		.then(() => route('/', false))
		.then(() => removeUsers())
		.catch(e => {
			console.error(e);
			Flash.setFlash('Something went wrong. Check your connection.', 'red', 'white');
		});


// Save diary page call
export const saveDiaryPage = (data, isSyncRequest = false) =>
	graphQLFetch(savePost(data))
		.then(resp => resp.SavePost)
		.then(data => {
			let post;

			switch(data.Status) {
				case 200:  // Take the user to dashboard
					// TODO: Add some kind of flash to notify user that its saved
					post = JSON.parse(data.Message);
					savePage(post);

					if(!isSyncRequest) {
						route('/', false);
					}
					return post;
				case 400:
					throw new Error(data.Message);
				case 401:
					throw new UnauthorizedError(data.Message, []);
				default: throw new Error(data.Message);
			}
		})
		.catch(e => {
			console.log(e);

			let errorMessage = 'Something went wrong';

			if(e instanceof UnauthorizedError) {
				errorMessage = 'You are not logged in. Please log in to continue.';
			} else {
				if(!isSyncRequest) {
					data.IsOffline = true;
					savePage(data);
					Flash.setFlash('Your post has been saved offline. It will be synced once you are back online.', 'green', 'white');
					return route('/', false);
				} else {
					errorMessage = 'Operation failed. Cannot connect to server';
				}
			}

			Flash.setFlash(errorMessage, 'red', 'white');
		});
