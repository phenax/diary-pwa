
import assign from 'object-assign';


export const savePost = (variables = {}) => ({
	variables,
	query: `
		query NewPost($Title: String, $Content: String, $Rating: Int) {
			NewPost(Title: $Title, Content: $Content, Rating: $Rating) {
				Status
				Message
			}
		}
	`,
});

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


export const getPost = (pageId = -1) => ({
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
