// 1. Importaciones necesarias
import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/categoria";

// 2. Referencias a los elementos del DOM
const listaProductos = document.getElementById("lista-productos") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const listaCategorias = document.getElementById("lista-categorias") as HTMLDivElement;

// Interfaz para el carrito
interface CartItem extends Product {
  cantidad: number;
}

// 3. Función para renderizar las tarjetas de productos
function renderProducts(productosA_Mostrar: Product[]) {
  listaProductos.innerHTML = "";

  if (productosA_Mostrar.length === 0) {
    listaProductos.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  productosA_Mostrar.forEach((producto) => {
    if (producto.eliminado || !producto.disponible) return;

    const card = document.createElement("div");
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "8px";
    card.style.padding = "15px";
    card.style.textAlign = "center";
    card.style.backgroundColor = "#fff";

    // CORRECCIÓN 1: Color naranja (#e67e22) y sin doble punto y coma
    card.innerHTML = `
      <img src="/${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
      <h3 style="margin: 10px 0; font-size: 1.2rem;">${producto.nombre}</h3>
      <p style="color: #666; font-size: 14px; height: 40px; overflow: hidden;">${producto.descripcion}</p>
      <p style="font-weight: bold; font-size: 1.2rem; color: #e67e22;">$${producto.precio}</p>
      <button id="btn-add-${producto.id}" class="btn-agregar" style="background-color: #e67e22; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; transition: all 0.3s ease;">
        Añadir al Carrito
      </button>
    `;

    listaProductos.appendChild(card);

    const btnAdd = document.getElementById(`btn-add-${producto.id}`) as HTMLButtonElement;
    btnAdd?.addEventListener("click", () => addToCart(producto, btnAdd));
  });
}

// 4. Función para renderizar el menú lateral de categorías
function renderCategories() {
  const categorias = getCategories();
  listaCategorias.innerHTML = "";

  const btnAll = document.createElement("button");
  btnAll.textContent = "Todas las categorías";
  btnAll.style.padding = "10px";
  btnAll.style.marginBottom = "5px";
  btnAll.style.cursor = "pointer";
  btnAll.addEventListener("click", () => renderProducts(PRODUCTS));
  listaCategorias.appendChild(btnAll);

  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;
    btn.style.padding = "10px";
    btn.style.marginBottom = "5px";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      const filtrados = PRODUCTS.filter(p => 
        p.categorias.some((c: ICategory) => c.id === cat.id) 
      );
      renderProducts(filtrados);
    });

    listaCategorias.appendChild(btn);
  });
}

// 5. Lógica del Buscador
searchInput.addEventListener("input", (e) => {
  const query = (e.target as HTMLInputElement).value.toLowerCase();
  const filtrados = PRODUCTS.filter(p => 
    p.nombre.toLowerCase().includes(query)
  );
  renderProducts(filtrados);
});

// 6. Lógica del Carrito con Efecto visual
function addToCart(producto: Product, boton: HTMLButtonElement) {
  const cartStorage = localStorage.getItem("cart");
  let cart: CartItem[] = cartStorage ? JSON.parse(cartStorage) : [];

  // CORRECCIÓN 3: Tipado explícito de (item: CartItem)
  const index = cart.findIndex((item: CartItem) => item.id === producto.id);

  if (index !== -1) {
    cart[index].cantidad += 1;
  } else {
    cart.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  // --- EFECTO VISUAL ---
  // CORRECCIÓN 2: El color original de retorno ahora es el naranja correcto
  const colorOriginal = "#e67e22";
  const textoOriginal = "Añadir al Carrito";

  boton.style.backgroundColor = "#2ecc71"; // Verde éxito
  boton.style.boxShadow = "0 0 10px #2ecc71";
  boton.textContent = "¡Agregado!";
  boton.disabled = true; 

  setTimeout(() => {
    boton.style.backgroundColor = colorOriginal;
    boton.style.boxShadow = "none";
    boton.textContent = textoOriginal;
    boton.disabled = false;
  }, 800);
}

// 7. Evento de inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts(PRODUCTS);
});