let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    setupEventListeners();
    addWelcomeAnimation();
});

function setupEventListeners() {
    document.getElementById('item-form').addEventListener('submit', handleSubmit);
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
}

function addWelcomeAnimation() {
    const header = document.querySelector('header');
    header.style.animation = 'fadeIn 0.8s ease';
}

async function loadItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error al cargar items:', error);
        showNotification('Error al cargar los items 😢', 'error');
    }
}

function displayItems(items) {
    const container = document.getElementById('items-list');
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>¡Aún no tienes items! 🎉</p>
                <p>Comienza agregando tu primer producto arriba</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(item => {
        const expirationClass = getExpirationClass(item.fecha_expiracion);
        const expirationDate = item.fecha_expiracion 
            ? new Date(item.fecha_expiracion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Sin fecha de expiración';
        
        const expirationEmoji = getExpirationEmoji(item.fecha_expiracion);
        
        return `
            <div class="item-card ${expirationClass}">
                <div class="item-header">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-category">${item.categoria}</div>
                </div>
                <div class="item-info">
                    <p><strong>Cantidad:</strong> ${item.cantidad} unidades</p>
                    <p><strong>Expira:</strong> ${expirationDate} ${expirationEmoji}</p>
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

function getExpirationClass(fecha) {
    if (!fecha) return '';
    
    const expDate = new Date(fecha);
    const today = new Date();
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring-soon';
    return '';
}

function getExpirationEmoji(fecha) {
    if (!fecha) return '✨';
    
    const expDate = new Date(fecha);
    const today = new Date();
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '⚠️';
    if (diffDays <= 7) return '⏰';
    return '✅';
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.btn-primary');
    const btnText = document.getElementById('btn-text');
    const originalText = btnText.textContent;
    
    btnText.textContent = editingId ? 'Actualizando...' : 'Guardando...';
    submitBtn.disabled = true;
    
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
            response = await fetch(`/api/items/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } else {
            response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }
        
        if (response.ok) {
            resetForm();
            loadItems();
            showNotification(
                editingId ? '¡Item actualizado con éxito! 🎉' : '¡Item agregado con éxito! 🎉',
                'success'
            );
        } else {
            showNotification('Oops, algo salió mal 😢', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al guardar el item 😢', 'error');
    } finally {
        btnText.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function editItem(id) {
    try {
        const response = await fetch(`/api/items/${id}`);
        const item = await response.json();
        
        editingId = id;
        document.getElementById('form-title').textContent = 'Editar Item';
        document.querySelector('.form-description').textContent = 'Modifica los campos que desees actualizar';
        document.getElementById('btn-text').textContent = 'Actualizar Item';
        document.getElementById('nombre').value = item.nombre;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('cantidad').value = item.cantidad;
        document.getElementById('fecha_expiracion').value = item.fecha_expiracion || '';
        document.getElementById('notas').value = item.notas || '';
        
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar el item 😢', 'error');
    }
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este item? 🤔')) return;
    
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadItems();
            showNotification('¡Item eliminado! 👋', 'success');
        } else {
            showNotification('Error al eliminar el item 😢', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar el item 😢', 'error');
    }
}

function resetForm() {
    editingId = null;
    document.getElementById('form-title').textContent = 'Agregar Nuevo Item';
    document.querySelector('.form-description').textContent = 'Llena los campos para agregar un nuevo producto a tu inventario';
    document.getElementById('btn-text').textContent = 'Guardar Item';
    document.getElementById('item-form').reset();
}

function showNotification(message, type) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#E83C91' : '#43334C'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);