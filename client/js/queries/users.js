
export const listUsers = variables => ({
	variables,
	query: `
		query User($name: String) {
			Users(name: $name) {
				Name
				Username
				Email
			}
		}
	`,
});

