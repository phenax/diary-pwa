package db

import (
	"os"
	"time"

	"github.com/phenax/diary-pwa/libs"
	mgo "gopkg.in/mgo.v2"
)

var connection *mgo.Session
var configCache *mgo.DialInfo

//
// GetConfig - Get the connection configuration for the db
//
// returns
// -- {*.mgo.DialInfo}  Dial information for a connection
//
func GetConfig() *mgo.DialInfo {

	return &mgo.DialInfo{
		Addrs:    []string{"localhost"},
		Timeout:  60 * time.Second,
		Database: "diary",
	}
}

//
// GetConnection - Get the connection (session object) singleton
//
// params
// -- prods {bool}  Optional production env config usage
//
// returns
// -- {*mgo.Session} The session
// -- {error}
//
func GetConnection(prods ...bool) (*mgo.Session, error) {

	var config *mgo.DialInfo
	prod := false

	if len(prods) > 0 {
		prod = prods[0]
	}

	// If the connection was already made, use it.
	if connection != nil {
		return connection, nil
	}

	// Production connection
	if prod {
		config = GetProdConfig()
	} else {
		config = GetConfig()
	}

	// New connection
	session, err := mgo.DialWithInfo(config)

	if err != nil {
		libs.Log("DB Connection error", err)
		return nil, err
	}

	// Save the connection
	connection = session
	configCache = config

	return session, nil
}

//
// GetDB - Get the database instance
//
// returns
// -- {*mgo.Database} Database instance
// -- {error}
//
func GetDB() (*mgo.Database, error) {

	prod := os.Getenv("ENV") == "production"

	// Get db connection
	conn, err := GetConnection(prod)

	if err != nil {
		return nil, err
	}

	return conn.DB(configCache.Database), nil
}
