package models

import (
	"log"

	"github.com/graphql-go/graphql"
)

//
// GraphQLResponseType - Schema
//
var GraphQLResponseType *graphql.Object

//
// GraphQLSchema - Schema
//
var graphQLSchema *graphql.Schema

//
// GetGraphQLSchema - Getter for the schema object
//
func GetGraphQLSchema() *graphql.Schema {

	if graphQLSchema == nil {

		fields := graphql.Fields{
			// User queries
			"Users":   GraphQLUsersField,
			"NewUser": GraphQLCreateUserField,

			// Post  queries
			"Posts":   GraphQLPostsField,
			"NewPost": GraphQLCreatePostField,
		}

		rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}

		schema, err := graphql.NewSchema(
			graphql.SchemaConfig{
				Query: graphql.NewObject(rootQuery),
			},
		)

		if err != nil {
			log.Fatalf("failed to create new schema, error: %v", err)
		}

		graphQLSchema = &schema
	}

	return graphQLSchema
}

//
// GQLResponse -
type GQLResponse struct {
	Status  int
	Message string
}

//
// NewResponse -
func NewResponse(status int, message string) *GQLResponse {
	return &GQLResponse{
		Status:  status,
		Message: message,
	}
}

func init() {
	GraphQLResponseType = graphql.NewObject(graphql.ObjectConfig{
		Name:        "Response",
		Description: "Standard graphql api response",
		Fields: graphql.Fields{
			"Status":  &graphql.Field{Type: graphql.Int},
			"Message": &graphql.Field{Type: graphql.String},
		},
	})
}