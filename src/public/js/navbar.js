/**
 * Inyecta dinámicamente la barra de navegación inferior en cualquier página HTML
 * sin necesidad de copiar y pegar el HTML en cada archivo.
 */
function renderBottomNavbar() {
    const tabs = [
        { id: 'tab-login', label: 'Login', href: 'login.html', roles: ['todos'] },
        { id: 'tab-pos', label: 'Punto Venta', href: 'pos.html', roles: ['Mesero', 'Admin'] },
        { id: 'tab-mesas', label: 'Mesas', href: 'mesas.html', roles: ['Mesero', 'Admin'] },
        { id: 'tab-cocina', label: 'Cocina', href: 'cocina.html', roles: ['Cocinero', 'Admin'] },
        { id: 'tab-inventario', label: 'Inventario', href: 'inventario.html', roles: ['Admin'] },
        { id: 'tab-corte', label: 'Corte', href: 'corte.html', roles: ['Admin'] },
        { id: 'tab-finanzas', label: 'Finanzas', href: 'finanzas.html', roles: ['Admin'] }
    ];

    // Detectar en qué página estamos actualmente
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const nav = document.createElement('nav');
    nav.className = 'bottom-navbar';
    nav.id = 'bottomNavbar';

    nav.innerHTML = tabs.map(tab => {
        const isActive = currentPath === tab.href ? 'active' : '';
        return `
            <a href="${tab.href}" class="nav-tab-item ${isActive}" id="${tab.id}">
                <span>${tab.label}</span>
            </a>
        `;
    }).join('');

    document.body.appendChild(nav);
}

// Renderizar automáticamente al cargar el DOM
document.addEventListener('DOMContentLoaded', renderBottomNavbar);

