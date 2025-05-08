package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"kiabq/hyperslice/internal/server"
	pkg "kiabq/hyperslice/internal/server"
	"net/http"
)

func RegisterRoutes(server *server.Server) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Cannot use any other method(s) to access this route
		if r.Method != "POST" {
			err := errors.New(pkg.INVALID_METHOD)
			http.Error(w, err.Error(), 405)
			return
		}

		code, err := server.Database.CreateCode()
		if err != nil {
			return
		}

		// 1. Insert code into database with associated URL
		// 2. Return shortened link
		// 3. On client, use shortened link via /id route
		// to fetch and redirect to associated link.

		w.Header().Set("Content-Type", "application/json")

		data := pkg.ResponseData{
			Message: "Success",
			Code:    200,
			Body:    code,
		}

		json.NewEncoder(w).Encode(data)
	})

	mux.HandleFunc("/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" && r.Method != "GET" {
			err := errors.New(pkg.INVALID_METHOD)
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
