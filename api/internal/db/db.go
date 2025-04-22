package db

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"math/rand"
	"os"
	"strconv"
)

type ConnConfig struct {
	Host     string
	Port     uint16
	Database string
	User     string
	Password string
}

// FormatConnString converts config to postgres connection string
func (c ConnConfig) FormatConnString() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.Host, c.Port, c.User, c.Password, c.Database)
}

type DatabaseMethods interface {
	CreateCode(url string) error
	CheckAlias(alias string) error
	FetchAlias(alias string) error
}

type DB struct {
	connection *sql.DB
}

// Create new database client
func NewDatabaseClient() *DB {
	port, err := strconv.ParseUint(os.Getenv("DATABASE_PORT"), 10, 16)
	if err != nil {
		// TODO: Do a graceful shutdown if this occurs
		log.Fatalf("Error parsing port to 16 bit uint: %w", err)
	}

	config := ConnConfig{
		Host:     os.Getenv("DATABASE_HOST"),
		Port:     uint16(port),
		Database: os.Getenv("DATABASE_NAME"),
		User:     os.Getenv("DATABASE_USER"),
		Password: os.Getenv("DATABASE_PASS"),
	}

	connString := ConnConfig.FormatConnString(config)

	psql, err := sql.Open("postgres", connString)
	if err != nil {
		panic(err)
	}

	// close database
	defer psql.Close()

	// check db
	err = psql.Ping()
	if err != nil {
		panic(err)
	}

	if err != nil {
		log.Fatalf("Error connecting to Postgres database: %+w\n", err)
	}

	return &DB{
		connection: psql,
	}
}

// Close database
func (d *DB) Close() error {
	return d.connection.Close()
}

func (d *DB) CreateCode() error {
	var code string = ""
	chars := []string{"abcdefghijklmnopqrstuvwrxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"}

	for i := 0; i < 6; i++ {
		char := int(math.Floor(rand.Float64() * float64(len(chars))))
		code += chars[char]
	}

	err := d.CheckAlias(code)
	if err != nil {
		fmt.Println("error occurred: ", err)
		return nil
	}

	// do join to check if code + alias combo exists
	rows, _ := d.connection.Query("select * from ")
	fmt.Println("rows: ", rows)

	return nil
}

func (d *DB) CheckAlias(alias string) error {
	resp, err := d.connection.Exec(`SELECT * FROM alias WHERE alias = $1`, alias)

	fmt.Println(resp, err)

	return nil
}

func (d *DB) FetchAlias() error {
	d.connection.Query("")

	return nil
}
