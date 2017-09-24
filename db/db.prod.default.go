package db

import (
	"time"

	"labix.org/v2/mgo"
)

// Rename the function and remove _
func GetProdConfig_() *mgo.DialInfo {

	return &mgo.DialInfo{

		Addrs: []string{"localhost"},

		Timeout: 60 * time.Second,

		Database: "diary",

		Username: "",
		Password: "",
	}
}
