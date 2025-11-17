package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

type DBConfig struct {
	User     string
	Password string
	Host     string
	Port     string
	Database string
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func ConnectDB() {
	config := DBConfig{
		User:     getEnv("DB_USER", "root"),
		Password: getEnv("DB_PASSWORD", "rootpassword"),
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "3306"),
		Database: getEnv("DB_NAME", "inventario_hogar"),
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Database,
	)

	var err error

	// Reintentar conexión hasta 30 segundos
	for i := 0; i < 30; i++ {
		DB, err = sql.Open("mysql", dsn)
		if err != nil {
			log.Printf("Intento %d: Error al abrir conexión: %v", i+1, err)
			time.Sleep(1 * time.Second)
			continue
		}

		err = DB.Ping()
		if err == nil {
			log.Println("Conexión exitosa a MySQL")
			return
		}

		log.Printf("Intento %d: Error al conectar: %v", i+1, err)
		time.Sleep(1 * time.Second)
	}

	log.Fatal("No se pudo conectar a MySQL después de 30 intentos")
}

func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Conexión a MySQL cerrada")
	}
}
