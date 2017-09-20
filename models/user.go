package models

import (
	"github.com/graphql-go/graphql"
	"github.com/phenax/diary/db"
	"github.com/phenax/diary/libs"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

//
// User type
//
type User struct {
	OID      bson.ObjectId `bson:"_id,omitempty"`
	ID       string        `bson:"uid,omitempty"`
	Name     string        `bson:"name"`
	Username string        `bson:"username"`
	Email    string        `bson:"email"`
	Password string        `bson:"password"`
}

// UserWithPost type (User with the posts inside)
type UserWithPost struct {
	User
	Posts              []Post `bson:"Posts"`
	TotalNumberOfPages int
	IsLastPage         bool
	IsFirstPage        bool
}

//
// SetPassword - Setter for the password field
// TODO: Encrypt the password
//
// params
// -- password {string}
//
func (user *User) SetPassword(password string) {
	user.Password = password
}

func err(msg string) map[string]string {
	return map[string]string{"Message": msg}
}

//
// Validate - Validator for user
func (user *User) Validate() map[string]string {

	if user.Name == "" && len(user.Name) < 5 {
		return err("The Name you entered was too short")
	}

	// TODO: Add username validation
	if user.Username == "" && len(user.Username) < 5 {
		return err("The Username you entered was too short")
	}

	// TODO: Email validation
	if user.Email == "" && len(user.Email) < 5 {
		return err("The Email you entered was too short")
	}

	if user.Password == "" && len(user.Password) < 5 {
		return err("The Password you entered was too short")
	}

	return map[string]string{"Message": "", "IsValid": "1"}
}

//
// UniqueCheck -
func (user *User) UniqueCheck() map[string]string {

	var oldUser User

	Users.Find(&bson.M{
		"$or": []bson.M{
			{"email": user.Email},
			{"username": user.Username},
		},
	}).One(&oldUser)

	libs.Log("Unique user check", oldUser)

	if oldUser.Username != "" {
		return err("This user already exists")
	}

	return map[string]string{"Message": "", "IsUnique": "1"}
}

//
//
//
/// ########################  GraphQL stuff  ######################## ///
//

//
// GraphQLUser - User type for graphql
//
var GraphQLUser = graphql.NewObject(graphql.ObjectConfig{
	Name:        "User",
	Description: "User of this app",
	Fields: graphql.Fields{
		"ID":       &graphql.Field{Type: graphql.String},
		"Name":     &graphql.Field{Type: graphql.String},
		"Username": &graphql.Field{Type: graphql.String},
		"Email":    &graphql.Field{Type: graphql.String},
	},
})

//
// GraphQLUserPosts - User type for graphql
//
var GraphQLUserPosts = graphql.NewObject(graphql.ObjectConfig{
	Name:        "UserPosts",
	Description: "User and his posts",
	Fields: graphql.Fields{
		"User":               &graphql.Field{Type: GraphQLUser},
		"Posts":              &graphql.Field{Type: graphql.NewList(GraphQLPost)},
		"TotalNumberOfPages": &graphql.Field{Type: graphql.Int},
		"IsLastPage":         &graphql.Field{Type: graphql.Boolean},
		"IsFirstPage":        &graphql.Field{Type: graphql.Boolean},
	},
})

//
// GraphQLUsersField - GraphQL Field information for user
//
var GraphQLUsersField *graphql.Field

//
// GraphQLCreateUserField - GraphQL Field information for user
//
var GraphQLCreateUserField *graphql.Field

func init() {

	GraphQLUsersField = &graphql.Field{
		Type: GraphQLUserPosts,
		Args: graphql.FieldConfigArgument{
			"start": &graphql.ArgumentConfig{
				Type:         graphql.Int,
				DefaultValue: -1,
			},
			"count": &graphql.ArgumentConfig{
				Type:         graphql.Int,
				DefaultValue: -1,
			},
			"search": &graphql.ArgumentConfig{
				Type:         graphql.String,
				DefaultValue: "",
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var user UserWithPost
			args := params.Args

			Users.Find(&bson.M{"uid": "59be56c65a421d74f9000001"}).One(&user.User)

			if user.User.ID != "" {

				postQuery := Posts.Find(&bson.M{"user_id": user.User.ID})

				numberOfPages, err := postQuery.Count()
				if err != nil {
					return nil, err
				}
				user.TotalNumberOfPages = numberOfPages

				start, _ := args["start"].(int)
				count, _ := args["count"].(int)

				if start >= 0 {
					postQuery.Skip(start)
				}
				if count >= 0 {
					postQuery.Limit(count)
				}

				user.IsFirstPage = true
				if start >= 0 && count >= 0 {
					user.IsFirstPage = start <= count
				}

				user.IsLastPage = true
				if postCount, err := postQuery.Count(); count >= 0 {
					if err != nil {
						return nil, err
					}
					user.IsLastPage = postCount < count
				}

				postQuery.All(&user.Posts)

				return user, nil
			}

			return nil, nil
		},
	}

	GraphQLCreateUserField = &graphql.Field{
		Type: GraphQLResponseType,
		Args: graphql.FieldConfigArgument{
			"Name":     &graphql.ArgumentConfig{Type: graphql.String},
			"Email":    &graphql.ArgumentConfig{Type: graphql.String},
			"Username": &graphql.ArgumentConfig{Type: graphql.String},
			"Password": &graphql.ArgumentConfig{Type: graphql.String},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			args := params.Args

			libs.Log("POST Users params", args)

			user := &User{
				ID:       bson.NewObjectId().Hex(),
				Name:     libs.Stringify(args["Name"]),
				Email:    libs.Stringify(args["Email"]),
				Username: libs.Stringify(args["Username"]),
				Password: libs.Stringify(args["Password"]),
			}

			validation := user.Validate()
			uniqueness := user.UniqueCheck()

			if validation["IsValid"] != "1" {
				return NewResponse(400, validation["Message"]), nil
			}
			if uniqueness["IsUnique"] != "1" {
				return NewResponse(409, uniqueness["Message"]), nil
			}

			user.SetPassword(user.Password)
			err := Users.Insert(user)

			if err != nil {
				return NewResponse(500, "Something went wrong"), nil
			}

			return NewResponse(200, "User saved successfully"), nil
		},
	}
}

//
//
//
/// ########################  Package stuff  ######################## ///
//

// Users - User Collection
var Users *mgo.Collection

const (
	// UserCollectionName - Collection name
	UserCollectionName = "users"
)

func init() {

	dbObj, _ := db.GetDB()

	// Cache it on start
	Users = dbObj.C(UserCollectionName)

	index := mgo.Index{
		Key:        []string{"uid", "email", "username"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err := Users.EnsureIndex(index)

	if err != nil {
		panic(err)
	}
}

//
// NewUser - Create a new user(make a copy of this user and modify for saving)
// (mostly for triggering setters)
//
// params
// -- user {*User}  User
//
// returns
// -- {*User} The better and save ready user
//
func NewUser(user *User) *User {

	newUser := *user

	newUser.SetPassword(user.Password)

	return &newUser
}
