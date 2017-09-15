package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	libs "github.com/phenax/diary/libs"
)

// Compiled templates go here
var compiledTemplates *template.Template

func init() {

	// Save it for the rest of eternity
	compiledTemplates = libs.ParseAllTemplates()
}

//
// Context - The server context
//
// fields
// -- res {http.ResponseWriter}
// -- req {*http.Request}
//
type Context struct {
	Response http.ResponseWriter
	Request  *http.Request
	Router   *mux.Router
	Params   map[string]string
}

//
// ResponseConfig - Craft a custom response
//
// fields
// -- StatusCode        {int}     The status code of the response to send
// -- Body              {string}  Content i.e. response body
// -- ContentType       {string}  The mimetype of the data (default = gzip)
// -- ContentEncoding   {string}  Specify the content encoding
//
type ResponseConfig struct {
	StatusCode      int
	Body            string
	ContentType     string `default:"text/plain; charset=utf-8"`
	ContentEncoding string
}

//
// Respond to the request using the config
//
// params
// -- config {*ResponseConfig}
//
func (ctx *Context) Respond(config *ResponseConfig) {

	headers := ctx.Response.Header()

	// Set the content type
	headers.Set("Content-Type", libs.GetField(config, "ContentType", config.ContentType))

	// Apply encoding
	if config.ContentEncoding != "" {
		headers.Set("Content-Encoding", config.ContentEncoding)
	}

	// Status code
	status := 200
	if config.StatusCode != 0 {
		status = config.StatusCode
	}

	ctx.Response.WriteHeader(status)

	// Response body
	if config.Body != "" {
		fmt.Fprint(ctx.Response, config.Body)
	}
}

//
// Send - Writes a string of html to response
//
// params
// -- str  {string}  The string to send
// -- config  {*ResponseConfig}  Optional configuration
//
func (ctx *Context) Send(str string, configs ...*ResponseConfig) {

	var config *ResponseConfig

	// Default to just status code config
	if len(configs) > 0 {
		config = configs[0]
	} else {
		config = &ResponseConfig{
			StatusCode: 200,
		}
	}

	config.Body = str

	ctx.Respond(config)
}

//
// JSON - Send some jsonn data to the client
//
// params
// -- obj {interface{}}  The json content as a struct
// -- config {*ResponseConfig} Optional config
//
func (ctx *Context) JSON(obj interface{}, configs ...*ResponseConfig) {

	jsonContent, err := json.Marshal(obj)

	var config *ResponseConfig

	// Default to just status code config
	if len(configs) > 0 {
		config = configs[0]
	} else {
		config = &ResponseConfig{
			StatusCode: 200,
		}
	}

	if err != nil {
		config.StatusCode = 500
	}

	config.ContentType = "application/json"

	ctx.Send(string(jsonContent), config)
}

//
// Render - Render a template and write to response
//
// params
// -- templateName {string}   Name of the template to render
//
func (ctx *Context) Render(templateName string, data interface{}, configs ...*ResponseConfig) {

	var config *ResponseConfig

	// Default to just status code config
	if len(configs) > 0 {
		config = configs[0]
	} else {
		config = &ResponseConfig{
			StatusCode: 200,
		}
	}

	// IF the content type is not set, default it to html
	if config.ContentType == "" {
		config.ContentType = "text/html; charset=utf-8"
	}

	// The template content
	buf := new(bytes.Buffer)

	err := compiledTemplates.ExecuteTemplate(buf, templateName+".gohtml", data)

	if err != nil {
		fmt.Fprint(ctx.Response, "Didnt render")
		fmt.Println(err)
		return
	}

	config.Body = string(buf.Bytes())

	// Respond with the stuff
	ctx.Respond(config)
}

//
// ErrorMessage - Send an error message
//
// params
// -- statusCode {int}   The status code of the response error
// -- err        {error} Error object
//
func (ctx *Context) ErrorMessage(statusCode int, err error) {

	fmt.Println("Error " + strconv.Itoa(statusCode) + ": " + err.Error())

	ctx.Send(err.Error(), &ResponseConfig{
		StatusCode: statusCode,
	})
}
