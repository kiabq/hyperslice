package main

import (
	"kiabq/hyperslice/internal/routes"
	"kiabq/hyperslice/internal/server"
	"log"
	"net/http"
	"time"
)

func main() {
	// Initialize server with configuration
	srv, err := server.New()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	// Ensure we close database connection when the server shuts down
	defer srv.Database.Close()

	// Create HTTP server
	httpServer := &http.Server{
		Addr:         ":8080",
		Handler:      routes.RegisterRoutes(srv),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("Starting server on :8080")
	log.Fatal(httpServer.ListenAndServe())
}
