package controllers

import (
	"errors"
	// "fmt"

	"github.com/phenax/diary-pwa/models"
	"labix.org/v2/mgo/bson"
)

//
// ProfilePage - Users profile page controller
//
// params
// -- ctx {*Context}
//
func ProfilePage(ctx *Context) {

	var user models.User

	// Get the route url parameter
	username := ctx.Params["name"]

	// Get the user with that username
	models.Users.Find(bson.M{
		"username": username,
	}).One(&user)

	// If nothing came back from the fetch
	if user.Username == "" {
		ctx.ErrorMessage(404, errors.New("No user with that username"))
		return
	}

	config := &ResponseConfig{
		ContentType: "text/html",
	}

	renderContent := &map[string]interface{}{
		"User":  user,
		"Ctx":   ctx,
		"Title": user.Name + "'s Profile",
	}

	ctx.Render("user", renderContent, config)
}
