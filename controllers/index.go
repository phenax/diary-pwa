package controllers

import (
	// "errors"
	// "net/http"
	// "fmt"
	// "reflect"

	// "labix.org/v2/mgo/bson"
	"github.com/phenax/idiotic/libs"
	"github.com/phenax/idiotic/models"
	// "github.com/gorilla/mux"
)

//
// HomePage - homepage controller
//
// params
// -- ctx {*Context}  Server request context
//
func HomePage(ctx *Context) {

	var users []models.User

	models.Users.Find(nil).All(&users)

	options := &map[string]interface{}{
		"Ctx":   ctx,
		"Users": users,
		"Title": "Welcome to this shit",
	}

	ctx.Render("index", options)
}

//
// JSONTest - Send json test data to the client
//
// params
// -- ctx {*Context}
//
func JSONTest(ctx *Context) {

	type Product struct {
		ID   int
		Name string
	}

	type Response struct {
		Access   bool
		Products []*Product
	}

	obj := &Response{
		Access: true,
		Products: []*Product{
			&Product{
				ID:   1,
				Name: "Soap",
			},
			&Product{
				ID:   2,
				Name: "Shampoo",
			},
		},
	}

	ctx.JSON(obj)
}

//
// GzipTest - Testing gzip compression on a string of content
//
// params
// -- ctx {*Context}
//
func GzipTest(ctx *Context) {

	content := `
		Disposable city market rain pistol saturation point hacker grenade engine range-rover.
		Neural gang dome nano-faded beef noodles bicycle footage kanji advert courier garage singularity.
		Rain concrete weathered industrial grade knife tank-traps sign RAF nodal point alcohol tower.
		Ablative spook neural military-grade engine cyber-carbon media shoes Kowloon knife.
		Numinous fluidity into market silent physical crypto-sprawl tanto euro-pop.
	`

	// Gzip the string
	gzipppedContent, err := libs.GzipString(content)

	if err != nil {
		ctx.ErrorMessage(500, err)
		return
	}

	ctx.Send(string(gzipppedContent), &ResponseConfig{
		ContentType:     "text/plain",
		ContentEncoding: "gzip",
	})
}
