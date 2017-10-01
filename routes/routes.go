package routes

import (
	"context"
	"net/http"

	ctrlr "github.com/phenax/diary-pwa/controllers"
	libs "github.com/phenax/diary-pwa/libs"
)

// Initialize the routes
func init() {

	router := libs.GetRouter()

	// Add static router
	ctrlr.StaticRouter(router, &ctrlr.StaticConfig{
		Pathprefix: "/public",
		Directory:  "./public",
	})

	// json test
	router.HandleFunc("/json", ctrlr.Call(ctrlr.JSONTest))

	// gzip test
	router.HandleFunc("/sw.js", ctrlr.Call(ctrlr.ServeServiceWorker))

	// gzip test
	router.HandleFunc("/verify", ctrlr.Call(ctrlr.Encrypt))

	// Graphql api endpoint
	router.HandleFunc("/graphql", func(w http.ResponseWriter, r *http.Request) {

		ctx := context.Background()
		ctx = context.WithValue(ctx, "request", r)
		ctx = context.WithValue(ctx, "response", w)

		ctrlr.GetGraphQLHandlerConfig().ContextHandler(ctx, w, r)
	})

	// Render all pages
	router.
		PathPrefix("/").
		HandlerFunc(ctrlr.Call(ctrlr.HomePage))

	// start with the base
	http.Handle("/", router)

}
