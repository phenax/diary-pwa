
import assign from 'object-assign';

export const listPosts = (variables = {}) => ({
	variables: assign({ 'start': -1, 'count': -1 }, variables),
	query: `
		query Posts($start: Int, $count: Int) {
			UserPosts(start: $start, count: $count) {
				User {
					Email
					ID
					Name
					Username
				}
				Posts {
					ID
					Title
					Content
					Rating
				}
			}
		}
	`,
});


export const getPost = (pageId) => ({
	variables: { pageId },
	query: `
		query Posts($pageId: String) {
			Post(pageId: $pageId) {
				Title
				Content
				Rating
			}
		}
	`,
});
