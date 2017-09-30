package db

import (
	appConfig "github.com/phenax/diary-pwa/config"
	"github.com/phenax/diary-pwa/libs"
	mgo "gopkg.in/mgo.v2"
)

var connection *mgo.Session

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
func GetConnection() (*mgo.Session, error) {

	// If the connection was already made, use it.
	if connection != nil {
		return connection, nil
	}

	config := appConfig.DBConnection

	// New connection
	session, err := mgo.DialWithInfo(config)

	if err != nil {
		libs.Log("DB Connection error", err)
		return nil, err
	}

	// Save the connection
	connection = session

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

	// Get db connection
	conn, err := GetConnection()

	if err != nil {
		return nil, err
	}

	return conn.DB(appConfig.DBConnection.Database), nil
}
