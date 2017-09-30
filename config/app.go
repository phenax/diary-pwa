package config

import (
	"os"
)

const (

	// AppName -
	AppName = "diary-pwa"
)

var (

	// Server -
	Server = map[string]string{
		"Port": os.Getenv("PORT"),
		"Host": os.Getenv("HOST"),
	}

	// UseHTTPS -
	UseHTTPS = true
)

func init() {

	if Server["Port"] == "" {
		Server["Port"] = "8080"
	}

	if Server["Host"] == "" {
		Server["Host"] = ""
	}
}
