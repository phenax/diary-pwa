package libs

import (
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"
)

//
// TemplateHelpers - Template helper functions
//
var TemplateHelpers template.FuncMap

func init() {

	TemplateHelpers = template.FuncMap{
		"GetLink": GetLink,
	}
}

//
// ParseAllTemplates - Parses all templates
//
// returns
// -- {*template.Template}
//
func ParseAllTemplates() *template.Template {

	root := filepath.Base(".")
	tmpl := template.New("wrapper").Funcs(TemplateHelpers)

	var files []string

	// Function runs for every file in the views dir
	walker := func(path string, info os.FileInfo, err error) error {

		if err != nil {
			return err
		}

		// Ignore all directories and non templates
		if info.IsDir() || !strings.HasSuffix(path, ".gohtml") {
			return nil
		}

		files = append(files, filepath.Join(root, path))
		return nil
	}

	// Walk through all templates
	err := filepath.Walk(filepath.Join(root, "views"), walker)

	if err != nil {
		fmt.Println("File walk Error", err)
	}

	// Parse all the files found in the walk
	return template.Must(tmpl.ParseFiles(files...))
}

//
// GetLink - Template helper function to get named router links
//
// params
// -- routeName {string}  Router name to craft the link for
// -- fields {...string}  A flat map of all fields and values to pass to the router
//
// returns
// -- {string}  The url
//
func GetLink(routeName string, fields ...string) string {

	router := GetRouter()

	url, err := router.Get(routeName).URL(fields...)

	if err != nil {
		fmt.Println(err)
		return ""
	}

	return url.String()
}
