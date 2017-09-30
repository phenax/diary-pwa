package db

import (
	"time"

	mgo "gopkg.in/mgo.v2"
)

// GetProdConfig_ - Rename the function and remove _
func GetProdConfig_() *mgo.DialInfo {

	return &mgo.DialInfo{

		Addrs: []string{"localhost"},

		Timeout: 60 * time.Second,

		Database: "diary",

		Username: "",
		Password: "",
	}
}
