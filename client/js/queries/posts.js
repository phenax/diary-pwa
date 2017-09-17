
export const listPosts = (variables = {}) => ({
	variables,
	query: `
		query Posts {
			UserPosts {
				Email
				ID
				Name
				Username
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
