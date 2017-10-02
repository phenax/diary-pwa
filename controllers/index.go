package controllers

import (
	// "errors"
	// "net/http"
	// "fmt"
	// "reflect"
	"io/ioutil"

	// "labix.org/v2/mgo/bson"
	"github.com/phenax/diary-pwa/config"
	"github.com/phenax/diary-pwa/libs"
	"github.com/phenax/diary-pwa/models"
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
		"Ctx":           ctx,
		"Users":         users,
		"Title":         "",
		"StaticVersion": config.StaticFileVersion,
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
// ServeServiceWorker - Serve the service worker js file
//
// params
// -- ctx {*Context}
//
func ServeServiceWorker(ctx *Context) {

	bundleStatsData, err := ioutil.ReadFile(config.BundleStatsFilepath)

	swScript := `self.STATIC_BASE_URL = '` + libs.GetStaticURL("") + `';
self.STATIC_CACHE_VERSION = '` + config.StaticFileVersion + `';
self.BUNDLE_STATS=` + string(bundleStatsData) + `;`

	serviceWorkerJsFile, err := ioutil.ReadFile(config.ServiceWorkerPath)

	if err != nil {
		ctx.ErrorMessage(500, err)
		return
	}

	swScript += string(serviceWorkerJsFile)

	ctx.Send(string(swScript), &ResponseConfig{
		ContentType: "application/javascript",
	})

	// Gzip the string
	// gzipppedContent, err := libs.GzipString(swScript)

	// if err != nil {
	// 	ctx.ErrorMessage(500, err)
	// 	return
	// }

	// ctx.Send(string(gzipppedContent), &ResponseConfig{
	// 	ContentType:     "application/javascript",
	// 	ContentEncoding: "gzip",
	// })
}
