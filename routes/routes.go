package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	ctrlr "github.com/phenax/diary/controllers"
	libs "github.com/phenax/diary/libs"
)

// Initialize the routes
func init() {

	router := libs.GetRouter()

	// Add static router
	ctrlr.StaticRouter(router, &ctrlr.StaticConfig{
		Pathprefix: "/public",
		Directory:  "./public",
	})

	indexRoutes(router)

	// start with the base
	http.Handle("/", router)

}

func indexRoutes(router *mux.Router) {

	// json test
	router.HandleFunc("/json", ctrlr.Call(ctrlr.JSONTest))

	// gzip test
	router.HandleFunc("/gzip", ctrlr.Call(ctrlr.GzipTest))

	// Graphql api endpoint
	router.Handle("/graphql", ctrlr.GetGraphQLHandlerConfig())

	// Render all pages
	router.
		PathPrefix("/").
		HandlerFunc(ctrlr.Call(ctrlr.HomePage))
}
