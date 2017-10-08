package models

import (
	"log"

	"github.com/graphql-go/graphql"
)

//
// GraphQLResponseType - Schema
//
var GraphQLResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Response",
	Description: "Standard graphql api response",
	Fields: graphql.Fields{
		"Status":  &graphql.Field{Type: graphql.Int},
		"Message": &graphql.Field{Type: graphql.String},
		"Data":    &graphql.Field{Type: graphql.String},
	},
})

//
// GraphQLSchema - Schema
//
var graphQLSchema *graphql.Schema

//
// GetGraphQLSchema - Getter for the schema object
//
func GetGraphQLSchema() *graphql.Schema {

	if graphQLSchema == nil {

		rootQuery := graphql.ObjectConfig{
			Name: "RootQuery",
			Fields: graphql.Fields{
				"Login":     GraphQLLoginUserField,
				"UserPosts": GraphQLUsersField,
				"Post":      GraphQLPostField,
			},
		}
		rootMutation := graphql.ObjectConfig{
			Name: "RootMutation",
			Fields: graphql.Fields{
				"CreateUser": GraphQLCreateUserField,
				"EditUser":   GraphQLEditUserField,
				"Logout":     GraphQLLogoutUserField,
				"SavePost":   GraphQLSavePostField,
			},
		}

		schema, err := graphql.NewSchema(
			graphql.SchemaConfig{
				Query:    graphql.NewObject(rootQuery),
				Mutation: graphql.NewObject(rootMutation),
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
	Data    map[string]string
}

//
// NewResponse -
func NewResponse(status int, message string, dataList ...map[string]string) *GQLResponse {

	var data map[string]string

	if len(dataList) != 0 {
		data = dataList[0]
	}

	return &GQLResponse{
		Status:  status,
		Message: message,
		Data:    data,
	}
}
