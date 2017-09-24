package main

import (
	"fmt"
	"net/http"
	"os"

	_ "github.com/phenax/diary-pwa/routes"
)

const (
	// DefaultHost The Host for the server
	DefaultHost = ""
	// DefaultPort The server port to listen to
	DefaultPort = "8080"
)

func main() {

	port := os.Getenv("PORT")
	host := os.Getenv("HOST")

	if port == "" {
		port = DefaultPort
	}
	if host == "" {
		host = DefaultHost
	}

	fmt.Println("Server has started on " + host + ":" + port)

	// Start the server
	http.ListenAndServe(host+":"+port, nil)
}
