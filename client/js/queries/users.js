

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


export const findUser = ({ username }) => ({
	variables: { username },
	query: `
		query UserFind($username:String) {
			UserPosts(username:$username) {
				User {
					Name
					Username
					Email
				}
			}
		}
	`,
});

