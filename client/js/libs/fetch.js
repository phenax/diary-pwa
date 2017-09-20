
import { API_ENDPOINT } from '../config/graphql';
import { listPosts } from '../queries/posts';

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


export const fetchUserPosts = vars =>
	graphQLFetch(listPosts(vars))
		.then(resp => resp.UserPosts);

window.fetchUserPosts = fetchUserPosts;
