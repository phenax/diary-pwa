
import { API_ENDPOINT } from '../config/graphql';
import { listPosts, getPost } from '../queries/posts';
import { login } from '../queries/users';


const graphQLFetch = query => {

	const config = {
		method: 'POST',
		body: JSON.stringify(query),
		headers: {
			'Accept': 'applications/json',
			'Content-Type': 'applications/json',
		},
	};

	return fetch(API_ENDPOINT, config)
		.then(resp => resp.json())
		.then(resp => {
			if(resp.error)
				throw new Error(resp.error);
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
		.then(resp => resp.Post);


export const loginUser = (username, password) =>
	graphQLFetch(login({ username, password }));
