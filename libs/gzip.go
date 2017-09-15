package libs

import (
	"bytes"
	"compress/gzip"
)

//
// GzipString - Compress a string with gzip
//
// params
// -- content {string}  The string to compress
//
// returns
// -- {[]bytes}         Compressed data
// -- {error}
//
func GzipString(content string) ([]byte, error) {

	var buff bytes.Buffer

	// New writer
	gzipWriter := gzip.NewWriter(&buff)

	if _, err := gzipWriter.Write([]byte(content)); err != nil {
		return nil, err
	}

	if err := gzipWriter.Flush(); err != nil {
		return nil, err
	}

	if err := gzipWriter.Close(); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}
