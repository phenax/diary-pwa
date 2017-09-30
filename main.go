package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	config "github.com/phenax/diary-pwa/config"
	_ "github.com/phenax/diary-pwa/routes"
)

func main() {

	port := os.Getenv("PORT")
	host := os.Getenv("HOST")

	if port == "" {
		port = config.Server["Port"]
	}
	if host == "" {
		host = config.Server["Host"]
	}

	fmt.Println("Server has started", ""+host+":"+port)

	var err error
	if config.UseHTTPS {
		// Start the server https
		err = http.ListenAndServeTLS(host+":"+port, config.Server["TLSCert"], config.Server["TLSKey"], nil)
	} else {
		// Start the server
		err = http.ListenAndServe(host+":"+port, nil)
	}

	log.Fatal(err)
}
