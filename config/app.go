package config

import (
	"os"
)

const (

	// AppName -
	AppName = "diary-pwa"

	// StaticFileVersion -
	StaticFileVersion = "0.0.1"

	// ServiceWorkerPath -
	ServiceWorkerPath = "public/js/serviceworker.js"

	// BundleStatsFilepath -
	BundleStatsFilepath = "client/bundle-stats.json"
)

var (

	// Server -
	Server = map[string]string{
		"Port": os.Getenv("PORT"),
		"Host": os.Getenv("HOST"),
	}
)

func init() {

	if Server["Port"] == "" {
		Server["Port"] = "8080"
	}

	if Server["Host"] == "" {
		Server["Host"] = ""
	}
}
