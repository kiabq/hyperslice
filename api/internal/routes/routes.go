package routes

import (
	"errors"
	"fmt"
	"html"
	"kiabq/hyperslice/internal/server"
	"net/http"
)

const (
	INVALID_METHOD string = "Method Not Allowed"
)

func RegisterRoutes(server *server.Server) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Cannot use any other method(s) to access this route
		if r.Method != "GET" {
			err := errors.New(INVALID_METHOD)
			http.Error(w, err.Error(), 405)
			return
		}

		server.Database.CheckAlias("")

		fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
	})

	mux.HandleFunc("/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" && r.Method != "GET" {
			err := errors.New(INVALID_METHOD)
			http.Error(w, err.Error(), 405)
			return
		}

		if r.Method == "GET" {
			// Do GET logic
		}

		if r.Method == "POST" {
			// Do POST logic
		}

		id := r.PathValue("id")
		fmt.Fprintf(w, "Hello, path: %q, id: %s", html.EscapeString(r.URL.Path), id)
	})

	return mux
}
