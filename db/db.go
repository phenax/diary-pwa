package db

import (
	"time"

	"labix.org/v2/mgo"
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
		Database: "idiotic",
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
		config = nil // GetProdConfig();
	} else {
		config = GetConfig()
	}

	// New connection
	session, err := mgo.DialWithInfo(config)

	if err != nil {
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
// params
// -- prods {bool} Optional parameter
//
// returns
// -- {*mgo.Database} Database instance
// -- {error}
//
func GetDB(prods ...bool) (*mgo.Database, error) {

	prod := false

	if len(prods) > 0 {
		prod = prods[0]
	}

	// Get db connection
	conn, err := GetConnection(prod)

	if err != nil {
		return nil, err
	}

	return conn.DB(configCache.Database), nil
}
