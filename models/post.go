package models

import (
	"encoding/json"
	"errors"

	"github.com/graphql-go/graphql"
	"github.com/phenax/diary-pwa/db"
	"github.com/phenax/diary-pwa/libs"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

//
// Post type
//
type Post struct {
	OID     bson.ObjectId `bson:"_id,omitempty"`
	ID      string        `bson:"pid,omitempty"`
	UserID  string        `bson:"user_id,omitempty"`
	Title   string        `bson:"title"`
	Content string        `bson:"content"`
	Rating  int           `bson:"rating"`
}

// PostWithUser type (post with the user)
type PostWithUser struct {
	Post,
	User User `bson:"Users"`
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
var GraphQLPost = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Post",
	Description: "An entry in the diary",
	Fields: graphql.Fields{
		"ID":      &graphql.Field{Type: graphql.String},
		"Title":   &graphql.Field{Type: graphql.String},
		"Content": &graphql.Field{Type: graphql.String},
		"Rating":  &graphql.Field{Type: graphql.Int},
		"UserID":  &graphql.Field{Type: graphql.String},
		// "Users": &graphql.Field{ Type: graphql.NewList(GraphQLUser) },
	},
})

//
// GraphQLPostField - GraphQL Field information for post
//
var GraphQLPostField *graphql.Field

//
// GraphQLSavePostField - GraphQL Field information for post
//
var GraphQLSavePostField *graphql.Field

func init() {

	GraphQLPostField = &graphql.Field{
		Type: GraphQLPost,
		Args: graphql.FieldConfigArgument{
			"pageId": &graphql.ArgumentConfig{
				Type:         graphql.String,
				DefaultValue: -1,
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var authUser SessionUser
			var post Post
			args := params.Args

			userSession := libs.GraphQLGetSession(params)
			// User logged in checked
			if userSession.Values["User"] == nil {
				return nil, errors.New("Unauthorized")
			}

			json.Unmarshal([]byte(userSession.Values["User"].(string)), &authUser)

			query := Posts.Find(&bson.M{
				"pid":     args["pageId"],
				"user_id": authUser.ID,
			})

			if n, err := query.Count(); n == 0 {
				if err != nil {
					return nil, err
				}
				return nil, nil
			}

			query.One(&post)
			return post, nil
		},
	}

	GraphQLSavePostField = &graphql.Field{
		Type: GraphQLResponseType,
		Args: graphql.FieldConfigArgument{
			"ID":      &graphql.ArgumentConfig{Type: graphql.String},
			"Title":   &graphql.ArgumentConfig{Type: graphql.String},
			"Content": &graphql.ArgumentConfig{Type: graphql.String},
			"Rating":  &graphql.ArgumentConfig{Type: graphql.Int},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var authUser SessionUser
			var updatePostIDStr string
			args := params.Args

			userSession := libs.GraphQLGetSession(params)

			updatePostID := args["ID"]
			isUpdateQuery := updatePostID != nil

			// User logged in checked
			if userSession.Values["User"] == nil {
				return NewResponse(401, "Unauthorized"), nil
			}

			json.Unmarshal([]byte(userSession.Values["User"].(string)), &authUser)

			if !isUpdateQuery {
				updatePostIDStr = bson.NewObjectId().Hex()
			} else {
				updatePostIDStr = updatePostID.(string)
			}

			post := &Post{
				ID:      updatePostIDStr,
				UserID:  authUser.ID,
				Title:   libs.Stringify(args["Title"]),
				Content: libs.Stringify(args["Content"]),
				Rating:  libs.Intify(args["Rating"]),
			}

			validation := post.Validate()

			libs.Log("Post", post)

			if validation["IsValid"] != "1" {
				return NewResponse(400, validation["Message"]), nil
			}

			var err error

			if isUpdateQuery {
				err = Posts.Update(&bson.M{"pid": updatePostIDStr}, post)
			} else {
				err = Posts.Insert(post)
			}

			if err != nil {
				return NewResponse(500, "Something went wrong"), nil
			}

			libs.Log("Before marshal", post)

			postJSON, _ := json.Marshal(post)
			libs.Log("After marshal", postJSON)
			return NewResponse(200, string(postJSON)), nil
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

	Posts = dbObj.C(PostCollectionName)

	index := mgo.Index{
		Key:        []string{"pid"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err := Posts.EnsureIndex(index)

	if err != nil {
		panic(err)
	}
}
