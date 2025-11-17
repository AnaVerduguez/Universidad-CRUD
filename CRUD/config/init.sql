-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    fecha_expiracion DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO items (nombre, categoria, cantidad, fecha_expiracion, notas) VALUES
('Arroz', 'Comida', 2, '2025-12-31', 'Paquete de 1kg'),
('Detergente', 'Limpieza', 1, NULL, 'Para ropa'),
('Leche', 'Comida', 3, '2024-02-15', 'Descremada'),
('Pasta Dental', 'Higiene', 2, '2025-06-30', 'Colgate'),
('Aceite', 'Comida', 1, '2025-08-20', 'Aceite de oliva');