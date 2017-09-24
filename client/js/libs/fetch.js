
import { API_ENDPOINT } from '../config/graphql';
import { listPosts, getPost, savePost } from '../queries/posts';
import { login, findUser as findUserQuery } from '../queries/users';
import { Extendable } from '../libs/utils';


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
		});


// Login a user
export const loginUser = (username, password) =>
	graphQLFetch(login({ username, password }));

// Save diary page call
export const saveDiaryPage = data =>
	graphQLFetch(savePost(data));

export const findUser = username =>
	graphQLFetch(findUserQuery({ username }));
