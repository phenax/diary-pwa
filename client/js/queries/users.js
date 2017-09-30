

export const signup = variables => ({
	variables,
	query: `
		mutation CreateUser($name: String, $email: String, $username: String, $password: String) {
			CreateUser(Name: $name, Email: $email, Username: $username, Password: $password) {
				Status,
				Message,
			}
		}
	`,
});


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
		query UserFind${username? '($username:String)': ''} {
			UserPosts${username? '(username:$username)': ''} {
				User {
					Name,
					Username,
					Email,
					${!username? `
						ID,
					`: ''}
				}
			}
		}
	`,
});


export const logout = () => ({
	variables: {},
	query: `
		mutation Logout {
			Logout {
				Status
				Message
			}
		}
	`,
});

