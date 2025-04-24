package main

import (
	"kiabq/hyperslice/internal/routes"
	"kiabq/hyperslice/internal/server"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")

	// Initialize server with configuration
	srv, err := server.New()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	// Ensure we close database connection when the server shuts down
	defer srv.Database.Close()

	// Create HTTP server
	httpServer := &http.Server{
		Addr:         os.Getenv("PORT"),
		Handler:      routes.RegisterRoutes(srv),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("connected on port %s", os.Getenv("PORT"))
	log.Fatal(httpServer.ListenAndServe())
}
