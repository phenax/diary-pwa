package libs

import (
	"github.com/gorilla/mux"
)

// Router instance stored
var routerInstance *mux.Router

//
// GetRouter - Get a router instance (singleton)
//
// params
// -- newInstance {bool}  Optional parameter to force a new instance
//
// returns
// -- {*mux.Router} Router instance
//
func GetRouter(newInstance ...bool) *mux.Router {

	forceNewInstance := false

	if len(newInstance) > 0 {
		forceNewInstance = newInstance[0]
	}

	if routerInstance == nil || forceNewInstance {
		routerInstance = mux.NewRouter()
	}

	return routerInstance
}
