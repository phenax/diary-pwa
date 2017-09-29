
import { route } from 'preact-router';

import { API_ENDPOINT } from '../config/graphql';

import { listPosts, getPost, savePost } from '../queries/posts';
import { login, findUser as findUserQuery } from '../queries/users';

import { Extendable } from '../libs/utils';
import { savePage } from '../libs/db';

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


// Save diary page call
export const saveDiaryPage = data =>
	graphQLFetch(savePost(data))
		.then(resp => resp.SavePost)
			.then(data => {
				let post;
				switch(data.Status) {
					case 200:  // Take the user to dashboard
						// TODO: Add some kind of flash to notify user that its saved
						post = JSON.parse(data.Message);
						savePage(post);
						return route('/', false);
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
				}

				Flash.setFlash(errorMessage, 'red', 'white');
			});
