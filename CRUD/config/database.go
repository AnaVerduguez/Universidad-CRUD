package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

// Configuración de la base de datos
type DBConfig struct {
	User     string
	Password string
	Host     string
	Port     string
	Database string
}

// ConnectDB establece la conexión con MySQL
func ConnectDB() {
	config := DBConfig{
		User:     "root",
		Password: "1655",
		Host:     "localhost",
		Port:     "3306",
		Database: "inventario_hogar",
	}

	// Formato: user:password@tcp(host:port)/database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Database,
	)

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error al abrir la conexión:", err)
	}

	// Verificar la conexión
	err = DB.Ping()
	if err != nil {
		log.Fatal("Error al conectar con la base de datos:", err)
	}

	log.Println("✅ Conexión exitosa a MySQL")
}

// CloseDB cierra la conexión
func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Conexión a MySQL cerrada")
	}
}
