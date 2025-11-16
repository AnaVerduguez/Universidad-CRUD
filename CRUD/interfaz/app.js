// Estado de la aplicación
let editingId = null;

// Cargar items al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('item-form').addEventListener('submit', handleSubmit);
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
}

// Cargar todos los items
async function loadItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        displayItems(items);
    } catch (error) {
        console.error('Error al cargar items:', error);
        alert('Error al cargar los items');
    }
}

// Mostrar items en la interfaz
function displayItems(items) {
    const container = document.getElementById('items-list');
    
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay items en el inventario</div>';
        return;
    }
    
    container.innerHTML = items.map(item => {
        const expirationClass = getExpirationClass(item.fecha_expiracion);
        const expirationDate = item.fecha_expiracion 
            ? new Date(item.fecha_expiracion).toLocaleDateString('es-ES')
            : 'Sin fecha';
        
        return `
            <div class="item-card ${expirationClass}">
                <div class="item-header">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-category">${item.categoria}</div>
                </div>
                <div class="item-info">
                    <p><strong>Cantidad:</strong> ${item.cantidad}</p>
                    <p><strong>Expira:</strong> ${expirationDate}</p>
                    ${item.notas ? `<p><strong>Notas:</strong> ${item.notas}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editItem(${item.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteItem(${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

// Determinar clase según fecha de expiración
function getExpirationClass(fecha) {
    if (!fecha) return '';
    
    const expDate = new Date(fecha);
    const today = new Date();
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring-soon';
    return '';
}

// Manejar envío del formulario
async function handleSubmit(e) {
    e.preventDefault();
    
    const item = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        fecha_expiracion: document.getElementById('fecha_expiracion').value || null,
        notas: document.getElementById('notas').value
    };
    
    try {
        let response;
        
        if (editingId) {
            // Actualizar
            response = await fetch(`/api/items/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } else {
            // Crear
            response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }
        
        if (response.ok) {
            resetForm();
            loadItems();
            alert(editingId ? 'Item actualizado' : 'Item creado');
        } else {
            alert('Error al guardar el item');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el item');
    }
}

// Editar item
async function editItem(id) {
    try {
        const response = await fetch(`/api/items/${id}`);
        const item = await response.json();
        
        editingId = id;
        document.getElementById('form-title').textContent = 'Editar Item';
        document.getElementById('nombre').value = item.nombre;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('cantidad').value = item.cantidad;
        document.getElementById('fecha_expiracion').value = item.fecha_expiracion || '';
        document.getElementById('notas').value = item.notas || '';
        
        // Scroll al formulario
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el item');
    }
}

// Eliminar item
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este item?')) return;
    
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadItems();
            alert('Item eliminado');
        } else {
            alert('Error al eliminar el item');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el item');
    }
}

// Resetear formulario
function resetForm() {
    editingId = null;
    document.getElementById('form-title').textContent = 'Agregar Nuevo Item';
    document.getElementById('item-form').reset();
}