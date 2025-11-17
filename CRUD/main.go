package main

import (
	"crud/config"
	"crud/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// Conectar a la base de datos
	config.ConnectDB()
	defer config.CloseDB()

	// Crear el router
	router := mux.NewRouter()

	// Inicializar handlers
	itemHandler := &handlers.ItemHandler{DB: config.DB}

	// Rutas API
	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/items", itemHandler.GetItems).Methods("GET")
	api.HandleFunc("/items/{id}", itemHandler.GetItem).Methods("GET")
	api.HandleFunc("/items", itemHandler.CreateItem).Methods("POST")
	api.HandleFunc("/items/{id}", itemHandler.UpdateItem).Methods("PUT")
	api.HandleFunc("/items/{id}", itemHandler.DeleteItem).Methods("DELETE")

	// Servir archivos estáticos
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./interface")))

	// Iniciar servidor
	log.Println("Servidor iniciado en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
