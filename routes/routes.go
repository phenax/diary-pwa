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

	indexRoutes(router)
	userRoutes(router)

	// Add static router
	ctrlr.StaticRouter(router, &ctrlr.StaticConfig{
		Pathprefix: "/public",
		Directory:  "./public",
	})

	// start with the base
	http.Handle("/", router)

}

func indexRoutes(router *mux.Router) {

	// Homepage
	router.HandleFunc("/", ctrlr.Call(ctrlr.HomePage))

	// json test
	router.HandleFunc("/json", ctrlr.Call(ctrlr.JSONTest))

	// gzip test
	router.HandleFunc("/gzip", ctrlr.Call(ctrlr.GzipTest))

}

func userRoutes(router *mux.Router) {

	// Profile page
	router.HandleFunc("/user/{name}", ctrlr.Call(ctrlr.ProfilePage)).Name("profile")
}
