package models

import (
	"database/sql"
	"time"
)

// Item representa un objeto del inventario
type Item struct {
	ID              int       `json:"id"`
	Nombre          string    `json:"nombre"`
	Categoria       string    `json:"categoria"`
	Cantidad        int       `json:"cantidad"`
	FechaExpiracion *string   `json:"fecha_expiracion,omitempty"`
	Notas           string    `json:"notas"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// GetAllItems obtiene todos los items
func GetAllItems(db *sql.DB) ([]Item, error) {
	query := `SELECT id, nombre, categoria, cantidad, fecha_expiracion, 
              notas, created_at, updated_at FROM items ORDER BY created_at DESC`

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var item Item
		err := rows.Scan(
			&item.ID,
			&item.Nombre,
			&item.Categoria,
			&item.Cantidad,
			&item.FechaExpiracion,
			&item.Notas,
			&item.CreatedAt,
			&item.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

// GetItemByID obtiene un item por su ID
func GetItemByID(db *sql.DB, id int) (*Item, error) {
	query := `SELECT id, nombre, categoria, cantidad, fecha_expiracion, 
              notas, created_at, updated_at FROM items WHERE id = ?`

	var item Item
	err := db.QueryRow(query, id).Scan(
		&item.ID,
		&item.Nombre,
		&item.Categoria,
		&item.Cantidad,
		&item.FechaExpiracion,
		&item.Notas,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &item, nil
}

// CreateItem crea un nuevo item
func CreateItem(db *sql.DB, item *Item) error {
	query := `INSERT INTO items (nombre, categoria, cantidad, fecha_expiracion, notas) 
              VALUES (?, ?, ?, ?, ?)`

	result, err := db.Exec(query, item.Nombre, item.Categoria, item.Cantidad,
		item.FechaExpiracion, item.Notas)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	item.ID = int(id)
	return nil
}

// UpdateItem actualiza un item existente
func UpdateItem(db *sql.DB, item *Item) error {
	query := `UPDATE items SET nombre = ?, categoria = ?, cantidad = ?, 
              fecha_expiracion = ?, notas = ? WHERE id = ?`

	_, err := db.Exec(query, item.Nombre, item.Categoria, item.Cantidad,
		item.FechaExpiracion, item.Notas, item.ID)
	return err
}

// DeleteItem elimina un item
func DeleteItem(db *sql.DB, id int) error {
	query := `DELETE FROM items WHERE id = ?`
	_, err := db.Exec(query, id)
	return err
}
