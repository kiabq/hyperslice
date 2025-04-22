package server

import (
	"kiabq/hyperslice/internal/db"

	_ "github.com/lib/pq"
)

type Server struct {
	Database *db.DB
}

func New() (*Server, error) {
	return &Server{
		Database: db.NewDatabaseClient(),
	}, nil
}
