package libs

import (
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
