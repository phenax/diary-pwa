
import assign from 'object-assign';

export const mergeQueries = (...queries) =>
	queries.reduce((carry, query) => ({
		variables: assign({}, (carry.variables || {}), query.variables),
		query: (carry.query || '') + query.query,
	}));
