package db

import (
	"time"

	"labix.org/v2/mgo"
)

func GetProdConfig() *mgo.DialInfo {

	return &mgo.DialInfo{

		Addrs:    []string{"localhost"},
		Timeout:  60 * time.Second,
		Database: "idiotic",
		Username: "",
		Password: "",
	}
}
