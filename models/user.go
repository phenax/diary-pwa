package models

import (
	"fmt"

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
	ID       bson.ObjectId `bson:"_id,omitempty"`
	Name     string        `bson:"name"`
	Username string        `bson:"username"`
	Email    string        `bson:"email"`
	Password string        `bson:"password"`
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
		"$or": &bson.M{
			"email":    user.Email,
			"username": user.Username,
		},
	}).One(&oldUser)

	fmt.Printf("%+v\n", oldUser)

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
var GraphQLUser *graphql.Object

//
// GraphQLUsersField - GraphQL Field information for user
//
var GraphQLUsersField *graphql.Field

//
// GraphQLCreateUsersField - GraphQL Field information for user
//
var GraphQLCreateUsersField *graphql.Field

func init() {
	GraphQLUser = graphql.NewObject(graphql.ObjectConfig{
		Name:        "User",
		Description: "User of this app",
		Fields: graphql.Fields{
			"ID":       &graphql.Field{Type: graphql.String},
			"Name":     &graphql.Field{Type: graphql.String},
			"Username": &graphql.Field{Type: graphql.String},
			"Email":    &graphql.Field{Type: graphql.String},
		},
	})

	GraphQLUsersField = &graphql.Field{
		Type: graphql.NewList(GraphQLUser),
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
			var userList []User
			args := params.Args
			libs.Log("GET Users", args)

			query := Users.Find(&bson.M{})

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

	GraphQLCreateUsersField = &graphql.Field{
		Type: GraphQLResponseType,
		Args: graphql.FieldConfigArgument{
			"Name":     &graphql.ArgumentConfig{Type: graphql.String},
			"Email":    &graphql.ArgumentConfig{Type: graphql.String},
			"Username": &graphql.ArgumentConfig{Type: graphql.String},
			"Password": &graphql.ArgumentConfig{Type: graphql.String},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			args := params.Args

			fmt.Printf("%+v\n", params.Args)

			user := &User{
				Name:     libs.Stringify(args["Name"]),
				Email:    libs.Stringify(args["Email"]),
				Username: libs.Stringify(args["Username"]),
				Password: libs.Stringify(args["Password"]),
			}

			validation := user.Validate()
			uniqueness := user.UniqueCheck()

			fmt.Printf("%+v\n", validation)

			if validation["IsValid"] != "1" || uniqueness["IsUnique"] != "1" {
				return NewResponse(400, validation["Message"]), nil
			}

			user.SetPassword(user.Password)
			// err := Users.Insert(user)

			// if err != nil {
			// 	return NewResponse(500, "Something went wrong"), nil
			// }

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
