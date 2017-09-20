

export const login = variables => ({
	variables,
	query: `
		query LoginUser($username: String, $password: String) {
			Login(Username: $username, Password: $password) {
				Status,
				Message,
			}
			UserPosts {
				User {
					ID,
					Name,
					Email,
					Username,
				}
			}
		}
	`
});

