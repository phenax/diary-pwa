
import { route } from 'preact-router';

import { API_ENDPOINT } from '../config/graphql';

import { listPosts, getPost, savePost } from '../queries/posts';
import { login, findUser as findUserQuery, signup, logout } from '../queries/users';

import { Extendable } from '../libs/utils';
import bus from '../libs/listeners';
import { savePage, removeUsers, removeAllPosts } from '../libs/db';

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

// Network timeout exception
export class TimeoutError extends Extendable(Error) {
	isTimeoutError = true;
	name = 'TimeoutError';

	constructor(message = 'Request timed out', errors) {
		super(message);
		if(errors) this.errors = errors;
	}
}


// Fetch the graphql api with the passed query
const graphQLFetch = query => {

	// Minify query(strip whitespaces)
	query.query =
		query.query
			.replace(/\s+/gi, ' ')
			.replace(/(^\s+|\s+$)/gi, '');

	const config = {
		method: 'POST',
		body: JSON.stringify(query),
		headers: {
			'Accept': 'applications/json',
			'Content-Type': 'applications/json',
		},
		credentials: 'same-origin',
		timeout: 5000,
	};

	return new Promise((resolve, reject) => {

		let isTimedOut = false;

		// Manual timeout
		setTimeout(() => {
			isTimedOut = true;
			reject(new TimeoutError());
		}, config.timeout);


		fetch(API_ENDPOINT, config)
			.then(resp => {
				// So that event after the response happens, it is ignored
				if(isTimedOut)
					throw new TimeoutError();
				return resp;
			})
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
			})
			.then(resolve)
			.catch(reject);
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
		.then(() => { removeUsers(); })
		.then(() => { removeAllPosts(); })
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
					post = JSON.parse(data.Message);
					savePage(post);

					if(!isSyncRequest) {
						Flash.setFlash('Your post has been saved', 'green', 'white');
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
