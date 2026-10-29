/**
 * Barra de navegación inferior con control de acceso por rol.
 * - Sin sesión: no se muestra la barra y se redirige a login.html.
 * - admin: acceso a todas las secciones.
 * - trabajador: las secciones restringidas se muestran bloqueadas.
 * - "Cerrar sesión" limpia la sesión y regresa al login.
 */

// Pestañas y roles permitidos (admin siempre tiene acceso)
const NAV_TABS = [
    { id: 'tab-pos', label: 'Punto Venta', href: 'pos.html', roles: ['admin', 'trabajador'] },
    { id: 'tab-mesas', label: 'Mesas', href: 'mesas.html', roles: ['admin', 'trabajador'] },
    { id: 'tab-cocina', label: 'Cocina', href: 'cocina.html', roles: ['admin', 'trabajador'] },
    { id: 'tab-inventario', label: 'Inventario', href: 'inventario.html', roles: ['admin'] },
    { id: 'tab-corte', label: 'Corte', href: 'corte.html', roles: ['admin'] },
    { id: 'tab-finanzas', label: 'Finanzas', href: 'finanzas.html', roles: ['admin'] }
];

// Convierte el rol guardado (BD: "Administrador", "trabajador") a "admin" | "trabajador"
function getRole() {
    const rol = (localStorage.getItem('rol') || '').toLowerCase();
    if (rol === 'admin' || rol === 'administrador') return 'admin';
    if (rol) return 'trabajador';
    return null;
}

function logout() {
    const limpiar = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
        window.location.replace('login.html');
    };
    // El servidor borra su cookie de sesión; pase lo que pase se limpia el navegador
    fetch('/api/v1/auth/logout', { method: 'POST' }).then(limpiar, limpiar);
}

function initNavbar() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isLoginPage = currentPath === 'login.html';
    const hasSession = Boolean(localStorage.getItem('token')) && getRole();

    // En el login no hay barra. Si llegamos aquí es porque el servidor no ve una sesión válida,
    // así que se limpia cualquier dato viejo del navegador.
    if (isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
        return;
    }

    // Sin datos de sesión no hay nada que mostrar: al login
    if (!hasSession) {
        window.location.replace('login.html');
        return;
    }

    const role = getRole();

    // Protege la URL escrita a mano: si no tiene permiso, regresa al POS
    const current = NAV_TABS.find(t => t.href === currentPath);
    if (current && !current.roles.includes(role)) {
        window.location.replace('pos.html');
        return;
    }

    const nav = document.createElement('nav');
    nav.className = 'bottom-navbar';
    nav.id = 'bottomNavbar';

    nav.innerHTML = NAV_TABS.map(tab => {
        const allowed = tab.roles.includes(role);
        if (!allowed) {
            return `<span class="nav-tab-item disabled" id="${tab.id}" title="Sin permiso" aria-disabled="true">
                        <span>🔒 ${tab.label}</span>
                    </span>`;
        }
        const isActive = currentPath === tab.href ? 'active' : '';
        return `<a href="${tab.href}" class="nav-tab-item ${isActive}" id="${tab.id}">
                    <span>${tab.label}</span>
                </a>`;
    }).join('') + `
        <button type="button" class="nav-tab-item nav-logout" id="tab-logout">
            <span>Cerrar sesión (${localStorage.getItem('usuario') || ''})</span>
        </button>`;

    document.body.appendChild(nav);
    document.getElementById('tab-logout').addEventListener('click', logout);
}

document.addEventListener('DOMContentLoaded', initNavbar);
