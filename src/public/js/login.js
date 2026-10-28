const form = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const formError = document.getElementById('formError');

// Mostrar / ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
});

function setError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.toggle('invalid', Boolean(message));
}

// Validación del lado del cliente
function validate() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value;
    let ok = true;

    if (!usuario) {
        setError(usuarioInput, 'usuarioError', 'Escribe tu usuario');
        ok = false;
    } else {
        setError(usuarioInput, 'usuarioError', '');
    }

    if (!password) {
        setError(passwordInput, 'passwordError', 'Escribe tu contraseña');
        ok = false;
    } else if (password.length < 4) {
        setError(passwordInput, 'passwordError', 'Mínimo 4 caracteres');
        ok = false;
    } else {
        setError(passwordInput, 'passwordError', '');
    }

    return ok;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.remove('show');

    if (!validate()) return;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';

    try {
        const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: usuarioInput.value.trim(),
                password: passwordInput.value
            })
        });
        // Si el servidor responde algo que no es JSON, no mostramos errores técnicos
        let data = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok || !data) {
            if (data && data.error && (res.status === 400 || res.status === 401)) {
                throw new Error(data.error);
            }
            if (res.status === 403) {
                throw new Error('No tienes permiso para entrar. Habla con el administrador.');
            }
            throw new Error('No pudimos iniciar sesión. Intenta de nuevo en unos minutos.');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('rol', data.rol);
        window.location.href = 'pos.html';
    } catch (err) {
        // Errores de red (TypeError) o cualquier otro mensaje técnico -> mensaje simple
        const esNuestro = err.message && !(err instanceof TypeError) && !/JSON|fetch/i.test(err.message);
        formError.textContent = esNuestro
            ? err.message
            : 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.';
        formError.classList.add('show');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
});

