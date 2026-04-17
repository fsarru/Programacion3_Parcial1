// 1. Importaciones necesarias (Ajusta las rutas según la ubicación exacta de tus carpetas)
import { PRODUCTS, getCategories } from "../../../utils/data";
import type { Product } from "../../../types/product";
// import { checkAuhtUser } from "../../../utils/auth"; // Descomentar cuando tengas el archivo de autenticación

// 2. Referencias a los elementos del DOM (Usamos casting "as..." para que TypeScript no se queje)
const listaProductos = document.getElementById("lista-productos") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const listaCategorias = document.getElementById("lista-categorias") as HTMLDivElement;

// Interfaz para el carrito (extiende el Producto agregando la propiedad 'cantidad')
interface CartItem extends Product {
  cantidad: number;
}

// 3. Función para renderizar las tarjetas de productos
function renderProducts(productosA_Mostrar: Product[]) {
  // Limpiamos el contenedor antes de dibujar
  listaProductos.innerHTML = "";

  if (productosA_Mostrar.length === 0) {
    listaProductos.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  productosA_Mostrar.forEach((producto) => {
    // Ignoramos los productos que están marcados como eliminados o no disponibles
    if (producto.eliminado || !producto.disponible) return;

    // Creamos la tarjeta del producto
    const card = document.createElement("div");
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "8px";
    card.style.padding = "15px";
    card.style.textAlign = "center";
    card.style.backgroundColor = "#fff";

    card.innerHTML = `
      <img src="/${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
      <h3 style="margin: 10px 0; font-size: 1.2rem;">${producto.nombre}</h3>
      <p style="color: #666; font-size: 14px; height: 40px; overflow: hidden;">${producto.descripcion}</p>
      <p style="font-weight: bold; font-size: 1.2rem; color: #2ecc71;">$${producto.precio}</p>
      <button id="btn-add-${producto.id}" style="background-color: #3498db; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold;">
        Añadir al Carrito
      </button>
    `;

    listaProductos.appendChild(card);

    // Le asignamos el evento click al botón "Añadir al Carrito" recién creado
    const btnAdd = document.getElementById(`btn-add-${producto.id}`);
    btnAdd?.addEventListener("click", () => addToCart(producto));
  });
}

// 4. Función para renderizar el menú lateral de categorías
function renderCategories() {
  const categorias = getCategories();
  listaCategorias.innerHTML = "";

  // Creamos un botón para "Ver Todo"
  const btnAll = document.createElement("button");
  btnAll.textContent = "Todas las categorías";
  btnAll.style.padding = "10px";
  btnAll.style.marginBottom = "5px";
  btnAll.style.cursor = "pointer";
  btnAll.addEventListener("click", () => renderProducts(PRODUCTS));
  listaCategorias.appendChild(btnAll);

  // Creamos un botón por cada categoría activa
  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;
    btn.style.padding = "10px";
    btn.style.marginBottom = "5px";
    btn.style.cursor = "pointer";

    // Al hacer clic, filtramos el array de productos y volvemos a renderizar
    btn.addEventListener("click", () => {
      const filtrados = PRODUCTS.filter(p => 
        p.categorias.some(c => c.id === cat.id)
      );
      renderProducts(filtrados);
    });

    listaCategorias.appendChild(btn);
  });
}

// 5. Lógica del Buscador en tiempo real
searchInput.addEventListener("input", (e) => {
  const query = (e.target as HTMLInputElement).value.toLowerCase();
  
  // Filtramos por coincidencia en el nombre
  const filtrados = PRODUCTS.filter(p => 
    p.nombre.toLowerCase().includes(query)
  );
  
  renderProducts(filtrados);
});

// 6. Lógica del Carrito con LocalStorage
function addToCart(producto: Product) {
  // Leemos lo que ya haya en el carrito. Si está vacío, iniciamos un array.
  const cartStorage = localStorage.getItem("cart");
  let cart: CartItem[] = cartStorage ? JSON.parse(cartStorage) : [];

  // Buscamos si el producto ya está en el carrito
  const index = cart.findIndex(item => item.id === producto.id);

  if (index !== -1) {
    // Si ya existe, solo sumamos 1 a la cantidad
    cart[index].cantidad += 1;
  } else {
    // Si es nuevo, lo agregamos al array con cantidad 1
    cart.push({ ...producto, cantidad: 1 });
  }

  // Guardamos el array actualizado en formato string dentro del localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Pequeño feedback visual (puedes reemplazarlo por un Toast o librería luego)
  alert(`✔️ ¡${producto.nombre} se agregó al carrito!`);
}

// 7. Evento de inicialización: Cuando carga la página, renderizamos todo
document.addEventListener("DOMContentLoaded", () => {
  // Proteger ruta aquí si fuera necesario
  // checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "client");

  renderCategories();
  renderProducts(PRODUCTS);
});