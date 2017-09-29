

export const login = variables => ({
	variables,
	query: `
		mutation LoginUser($username: String, $password: String) {
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
		query UserFind${username? '($username:String)': ''} {
			UserPosts${username? '(username:$username)': ''} {
				User {
					Name
					Username
					Email
					${!username? `
						ID
					`: ''}
				}
			}
		}
	`,
});

