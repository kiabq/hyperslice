package server

const (
	INVALID_METHOD string = "Method Not Allowed"
)

type ResponseData struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Body    any    `json:"body"`
}

type ResponseDataError struct{}
