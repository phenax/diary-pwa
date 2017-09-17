package controllers

import (
	// "errors"
	// "net/http"
	// "fmt"
	// "reflect"

	// "labix.org/v2/mgo/bson"
	"github.com/phenax/diary/libs"
	"github.com/phenax/diary/models"
	// "github.com/gorilla/mux"
)

const (
	// EncryptionKey - Key to use in the encryption algorithm
	EncryptionKey = "98c36hby8iwnseho8qwy38ryuagnukdshxkvastcvw4"
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
		"Title": "",
	}

	ctx.Render("index", options)
}

//
// Encrypt - Encrypt and decrypt string
func Encrypt(ctx *Context) {

	response := map[string]string{}

	ctx.JSON(response)
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
