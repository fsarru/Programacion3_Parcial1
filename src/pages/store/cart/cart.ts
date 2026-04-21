import type { Product } from "../../../types/product";

// 1. PROTECCIÓN DE RUTA
function checkSession() {
    const sesion = localStorage.getItem("userData");
    if (!sesion) {
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
        localStorage.removeItem("userData");
        window.location.replace("/src/pages/auth/login/login.html");
        return false;
    }
}

if (!checkSession()) {
    throw new Error("Acceso denegado.");
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

// 3. LÓGICA DE ACTUALIZACIÓN DE CANTIDADES (Punto 2 y 3)
const cambiarCantidad = (id: number, delta: number) => {
    const carritoRaw = localStorage.getItem("cart");
    let carrito: CartItem[] = carritoRaw ? JSON.parse(carritoRaw) : [];

    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad += delta;

        // Si la cantidad llega a 0 o menos, eliminamos el producto
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        // Guardamos en LocalStorage (Persistencia al refrescar)
        localStorage.setItem("cart", JSON.stringify(carrito));
        
        // Volvemos a dibujar
        renderizarCarrito();
    }
};

// 4. LÓGICA DE RENDERIZADO
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
                <a href="../home/home.html" style="color: #e67e22; text-decoration: none; font-weight: bold;"> ¿Qué te gustaría comer hoy? 🍕</a>
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
            <div style="flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <button class="btn-restar" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer; border-radius: 4px; border: 1px solid #ddd; background: #fff;">-</button>
                <span style="min-width: 20px; font-weight: bold;">${item.cantidad}</span>
                <button class="btn-sumar" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer; border-radius: 4px; border: 1px solid #ddd; background: #fff;">+</button>
            </div>
            <div style="flex: 1; text-align: right; font-weight: bold; color: #27ae60;">
                $${subtotal.toFixed(2)}
            </div>
        `;
        
        cartContainer.appendChild(fila);
    });

    totalCarrito.textContent = totalAcumulado.toFixed(2);

    // Asignar eventos a los botones de + y - recién creados
    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.currentTarget as HTMLButtonElement).dataset.id);
            cambiarCantidad(id, 1);
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.currentTarget as HTMLButtonElement).dataset.id);
            cambiarCantidad(id, -1);
        });
    });
};

// 5. FUNCIONES DE BOTONES GENERALES
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

// 6. INICIALIZACIÓN
// Ejecutamos el renderizado apenas carga la página
document.addEventListener("DOMContentLoaded", renderizarCarrito);