package main

import (
	"fmt"
	"net/http"

	_ "github.com/phenax/idiotic/routes"
)

const (
	// HOST The Host for the server
	HOST = ""
	// PORT The server port to listen to
	PORT = "8080"
)

func main() {

	fmt.Println("Server has started on " + HOST + ":" + PORT)

	// Start the server
	http.ListenAndServe(HOST+":"+PORT, nil)
}
