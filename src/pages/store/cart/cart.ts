import type { Product } from "../../../types/product";

// 1. PROTECCIÓN DE RUTA (A prueba de bucles infinitos)
function checkSession() {
    const sesion = localStorage.getItem("userData");
    if (!sesion) {
        console.warn("No hay sesión. Redirigiendo al login...");
        window.location.replace("/src/pages/auth/login/login.html");
        return false;
    }
    
    try {
        const user = JSON.parse(sesion);
        if (user.role !== "client") {
            window.location.replace("/src/pages/auth/login/login.html");
            return false;
        }
        return true;
    } catch (e) {
        // Si el JSON falla, borramos la basura y redirigimos
        localStorage.removeItem("userData");
        window.location.replace("/src/pages/auth/login/login.html");
        return false;
    }
}

// Si la sesión no es válida, detenemos la ejecución del resto del script
if (!checkSession()) {
    throw new Error("Acceso denegado. Deteniendo ejecución.");
}

// Interfaz local para el ítem con cantidad
interface CartItem extends Product {
    cantidad: number;
}

// 2. REFERENCIAS AL DOM
const cartContainer = document.getElementById("cart-container") as HTMLDivElement;
const totalCarrito = document.getElementById("cart-total") as HTMLSpanElement;
const btnVaciar = document.getElementById("btn-empty") as HTMLButtonElement;
const btnLogout = document.getElementById("btn-logout") as HTMLButtonElement;

// 3. LÓGICA DE RENDERIZADO
const renderizarCarrito = () => {
    if (!cartContainer || !totalCarrito) return;

    const carritoRaw = localStorage.getItem("cart");
    const carrito: CartItem[] = carritoRaw ? JSON.parse(carritoRaw) : [];
    
    cartContainer.innerHTML = "";
    let totalAcumulado = 0;

    if (carrito.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align:center; padding: 20px; color: #888;">
                <p>Tu carrito está vacío.</p>
                <a href="../home/home.html" style="color: #e67e22; text-decoration: none; font-weight: bold;">Ir a comprar algo 🍕</a>
            </div>
        `;
        totalCarrito.textContent = "0.00";
        return;
    }

    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        totalAcumulado += subtotal;

        const fila = document.createElement("div");
        fila.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;";
        
        fila.innerHTML = `
            <div style="flex: 2;">
                <h4 style="margin: 0;">${item.nombre}</h4>
                <small style="color: #666;">Precio Unitario: $${item.precio}</small>
            </div>
            <div style="flex: 1; text-align: center;">
                <span>Cantidad: <strong>${item.cantidad}</strong></span>
            </div>
            <div style="flex: 1; text-align: right; font-weight: bold; color: #27ae60;">
                $${subtotal.toFixed(2)}
            </div>
        `;
        
        cartContainer.appendChild(fila);
    });

    totalCarrito.textContent = totalAcumulado.toFixed(2);
};

// 4. FUNCIONES DE BOTONES
btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem("cart");
        renderizarCarrito();
    }
});

btnLogout?.addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location.replace("/src/pages/auth/login/login.html");
});

// 5. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", renderizarCarrito);