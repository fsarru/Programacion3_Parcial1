import type { Product } from "../../../types/product";

// Interfaz local para el ítem con cantidad
interface CartItem extends Product {
    cantidad: number;
}

// REFERENCIAS AL DOM
const cartContainer = document.getElementById("cart-container") as HTMLDivElement;
const totalCarrito = document.getElementById("cart-total") as HTMLSpanElement;
const btnVaciar = document.getElementById("btn-empty") as HTMLButtonElement;

// LÓGICA DE ACTUALIZACIÓN DE CANTIDADES
const cambiarCantidad = (id: number, delta: number) => {
    const carritoRaw = localStorage.getItem("cart");
    let carrito: CartItem[] = carritoRaw ? JSON.parse(carritoRaw) : [];

    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad += delta;

        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(carrito));
        renderizarCarrito();
    }
};

// LÓGICA DE RENDERIZADO
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
                <button class="btn-restar" data-id="${item.id}" style="padding: 2px 10px; cursor: pointer; border-radius: 6px; border: 2px solid #e67e22; background: white; color: #e67e22; font-weight: bold;">-</button>
                <span style="min-width: 25px; font-weight: bold; font-size: 1.1rem;">${item.cantidad}</span>
                <button class="btn-sumar" data-id="${item.id}" style="padding: 2px 10px; cursor: pointer; border-radius: 6px; border: 2px solid #e67e22; background: white; color: #e67e22; font-weight: bold;">+</button>
            </div>
            <div style="flex: 1; text-align: right; font-weight: bold; color: #27ae60;">
                $${subtotal.toFixed(2)}
            </div>
        `;
        
        cartContainer.appendChild(fila);
    });

    totalCarrito.textContent = totalAcumulado.toFixed(2);

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

// FUNCIONES DE BOTONES GENERALES
btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem("cart");
        renderizarCarrito();
    }
});

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", renderizarCarrito);