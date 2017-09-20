package libs

import (
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/graphql-go/graphql"
)

const (
	sessionSecret = "e07e8e6e51bc6d169070b5cb468ca200:4c3b687c718018f0d5d28be95796251c"
	sessionName   = "SESSIONID"
)

//
// SessionStore - Session
//
var SessionStore = sessions.NewCookieStore([]byte(sessionSecret))

func parseGraphQLParams(params graphql.ResolveParams) (*http.Request, http.ResponseWriter) {
	req := params.Context.Value("request").(*http.Request)
	res := params.Context.Value("response").(http.ResponseWriter)

	return req, res
}

//
// GraphQLSetSession -
//
func GraphQLSetSession(params graphql.ResolveParams, callback func(*sessions.Session) *sessions.Session) {

	req, res := parseGraphQLParams(params)

	userSession := GraphQLGetSession(params)

	userSession = callback(userSession)

	sessions.Save(req, res)
}

//
// GraphQLGetSession -
//
func GraphQLGetSession(params graphql.ResolveParams) *sessions.Session {

	req, _ := parseGraphQLParams(params)

	userSession, err := SessionStore.Get(req, sessionName)

	if err != nil {
		fmt.Println("Err")
	}

	return userSession
}
