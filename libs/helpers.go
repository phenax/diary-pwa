package libs

import (
	"fmt"
	"reflect"
)

//
// GetField - Get field and apply the default value(if any)
//
// params
// -- config {interface{}}  The structure
// -- key    {string}       The field with the default set
// -- value  {string}       The value of that field
//
// returns
// -- {string} The real value
//
func GetField(config interface{}, key string, value string) string {

	if value == "" {

		configType := reflect.TypeOf(config)

		field, _ := configType.FieldByName(key)

		return field.Tag.Get("default")
	}

	return value
}

//
// Stringify -
func Stringify(data interface{}) string {

	if str, ok := data.(string); ok {
		return str
	}

	return ""
}

//
// Log stuff to console
func Log(name string, variable interface{}) {
	COLOR := "32"
	fmt.Printf("\033[%sm%s:\033[0m %+v\n", COLOR, name, variable)
}
