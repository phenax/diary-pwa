package models

import (
	"github.com/graphql-go/graphql"
	"github.com/phenax/diary/db"
	"github.com/phenax/diary/libs"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

//
// Post type
//
type Post struct {
	ID      bson.ObjectId `bson:"_id,omitempty"`
	UserID  string        `bson:"user_id"`
	Title   string        `bson:"title"`
	Content string        `bson:"content"`
	Rating  int           `bson:"rating"`
}

//
// Validate - Validator for user
func (post *Post) Validate() map[string]string {

	// if user.Name == "" && len(user.Name) < 5 {
	// 	return err("The Name you entered was too short")
	// }

	return map[string]string{"Message": "", "IsValid": "1"}
}

//
//
//
/// ########################  GraphQL stuff  ######################## ///
//

//
// GraphQLPost - Post type for graphql
//
var GraphQLPost *graphql.Object

//
// GraphQLPostsField - GraphQL Field information for post
//
var GraphQLPostsField *graphql.Field

//
// GraphQLCreatePostField - GraphQL Field information for post
//
var GraphQLCreatePostField *graphql.Field

func init() {
	GraphQLPost = graphql.NewObject(graphql.ObjectConfig{
		Name:        "Post",
		Description: "An entry in the diary",
		Fields: graphql.Fields{
			"ID":      &graphql.Field{Type: graphql.String},
			"Title":   &graphql.Field{Type: graphql.String},
			"Content": &graphql.Field{Type: graphql.String},
			"Rating":  &graphql.Field{Type: graphql.Int},
			"UserID":  &graphql.Field{Type: graphql.String},
			"User": &graphql.Field{
				Type: graphql.String,
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					libs.Log("Graphql Post User params", params)
					return "yoyo", nil
				},
			},
		},
	})

	GraphQLPostsField = &graphql.Field{
		Type: graphql.NewList(GraphQLPost),
		Args: graphql.FieldConfigArgument{
			"start": &graphql.ArgumentConfig{
				Type:         graphql.Int,
				DefaultValue: -1,
			},
			"count": &graphql.ArgumentConfig{
				Type:         graphql.Int,
				DefaultValue: -1,
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var userList []Post
			args := params.Args
			libs.Log("GET Posts params", args)

			query := Posts.Find(&bson.M{})

			if start, ok := args["start"].(int); ok && args["start"] != -1 {
				query.Skip(start)
			}

			if count, ok := args["count"].(int); ok && args["count"] != -1 {
				query.Limit(count)
			}

			query.All(&userList)

			return userList, nil
		},
	}

	GraphQLCreatePostField = &graphql.Field{
		Type: GraphQLResponseType,
		Args: graphql.FieldConfigArgument{
			"UserID":  &graphql.ArgumentConfig{Type: graphql.String},
			"Title":   &graphql.ArgumentConfig{Type: graphql.String},
			"Content": &graphql.ArgumentConfig{Type: graphql.String},
			"Rating":  &graphql.ArgumentConfig{Type: graphql.Int},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			args := params.Args

			libs.Log("POST Posts params", args)

			post := &Post{
				UserID:  libs.Stringify(args["UserID"]),
				Title:   libs.Stringify(args["Title"]),
				Content: libs.Stringify(args["Content"]),
				Rating:  libs.Intify(args["Rating"]),
			}

			validation := post.Validate()

			if validation["IsValid"] != "1" {
				return NewResponse(400, validation["Message"]), nil
			}

			err := Posts.Insert(post)

			if err != nil {
				return NewResponse(500, "Something went wrong"), nil
			}

			return NewResponse(200, "Post saved successfully"), nil
		},
	}
}

//
//
//
/// ########################  Package stuff  ######################## ///
//

//
// Posts - Post Collection
var Posts *mgo.Collection

const (
	// PostCollectionName - Collection name
	PostCollectionName = "posts"
)

func init() {

	dbObj, _ := db.GetDB()

	// Cache it on start
	Posts = dbObj.C(PostCollectionName)
}
