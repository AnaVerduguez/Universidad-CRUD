CREATE DATABASE inventario_hogar;

USE inventario_hogar;

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    fecha_expiracion DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO items (nombre, categoria, cantidad, fecha_expiracion, notas) VALUES
('Arroz', 'Comida', 2, '2025-12-31', 'Paquete de 1kg'),
('Detergente', 'Limpieza', 1, NULL, 'Para ropa'),
('Leche', 'Comida', 3, '2024-02-15', 'Descremada');