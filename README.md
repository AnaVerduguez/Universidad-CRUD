# 💻 TP Final

**Alumno:** Ana Belen Verduguez

**Materia:** Técnicas Avanzadas de Programación

**Profesor:** Fabio Lastra

**Año:** 2025

---


## 📋 Descripción del Proyecto

Sistema CRUD (Create, Read, Update, Delete) para gestionar el inventario del hogar. Permite administrar productos de diferentes categorías (Comida, Limpieza, Higiene, Otros) con control de cantidades, fechas de expiración y notas adicionales.


## 🛠️ Tecnologías Utilizadas

- **Backend:** Go (Golang) 1.22
- **Base de Datos:** MySQL 8.0
- **Frontend:** HTML5, CSS3 y JavaScript
- **Contenedores:** Docker & Docker Compose
- **API Testing:** Bruno
- **Control de Versiones:** Git & GitHub


## 🚀 Instalación y Uso
### 1. Clonar el repositorio

```bash
git clone https://github.com/AnaVerduguez/Universidad-CRUD.git
```

### 2. Levantar el proyecto

```bash
docker-compose up -d
```

### 3. Abrir aplicación

Abra la aplicación en su navegador en:

```bash
start http://localhost:8080
```

## 4. Detener el proyecto

```bash
docker-compose stop
```

## 🧪 Probar la API con Bruno

Este proyecto incluye una colección de Bruno para probar todos los endpoints disponibles.

### Instalar Bruno

Descarga desde: https://www.usebruno.com/downloads

### Usar la colección

1. Abre Bruno
2. Click en **"Open Collection"**
3. Selecciona la carpeta `bruno/`
4. Ejecuta los requests

### Endpoints disponibles

- **Crear un item**
- **Obtener todos los items**
- **Obtener un item por su ID**
- **Actualizar un item**
- **Eliminar un item**
