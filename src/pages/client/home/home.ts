import { PRODUCTS, getCategories } from "../../../data/data";

// --- 1. PROTECCIÓN DE RUTA (Lógica Única y Segura) ---
const sesion = localStorage.getItem("userData");
let esClienteValido = false;

if (sesion) {
    try {
        const user = JSON.parse(sesion);
        // Verificamos que exista y que el rol sea client
        if (user && user.role === "client") {
            esClienteValido = true;
        }
    } catch (e) {
        console.error("Error al leer la sesión");
    }
}

// Si no es válido, redirigimos de forma absoluta y detenemos el script
if (!esClienteValido) {
    const urlLogin = window.location.origin + "/src/pages/auth/login/login.html";
    window.location.replace(urlLogin);
    throw new Error("Redirigiendo al login..."); // Detiene la ejecución para evitar errores de DOM
}

// --- 2. ELEMENTOS DEL DOM ---
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const contenedorGrid = document.getElementById("contenedor-grid") as HTMLDivElement;
const inputBusqueda = document.getElementById("buscarProducto") as HTMLInputElement;
const btnLogout = document.getElementById("btn-logout") as HTMLButtonElement;

// --- 3. LÓGICA DEL CATÁLOGO ---
const cargarcategorias = () => {
    const categorias = getCategories();
    if (!listaCategorias) return;

    listaCategorias.innerHTML = ""; 

    // Botón "Todas"
    const liAll = document.createElement('li');
    liAll.innerHTML = `<a href="#" style="text-decoration:none; color:#333; font-weight: bold;">Ver Todas</a>`;
    liAll.onclick = (e) => {
        e.preventDefault();
        cargarproductos(PRODUCTS);
    };
    listaCategorias.appendChild(liAll);

    // Botones por categoría
    categorias.forEach((categoria) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" style="text-decoration:none; color:#333;">${categoria.nombre}</a>`; 
        li.onclick = (e) => {
            e.preventDefault();
            const filtrados = PRODUCTS.filter(p => p.categorias.some(c => c.id === categoria.id));
            cargarproductos(filtrados);
        };
        listaCategorias.appendChild(li);
    });
};

const cargarproductos = (productosAMostrar: any[]) => {
    if (!contenedorGrid) return;
    contenedorGrid.innerHTML = ""; 

    productosAMostrar.forEach((producto) => {
        if (producto.eliminado || !producto.disponible) return;

        const article = document.createElement("article");
        article.style.cssText = "border: 1px solid #eee; padding: 15px; border-radius: 8px; background: #fff; text-align: center; display: flex; flex-direction: column; justify-content: space-between;";

        article.innerHTML = `
            <div>
                <img src="/${producto.imagen}" alt="${producto.nombre}" style="width:100%; height:150px; object-fit:contain; border-radius: 4px;">
                <h3 style="margin:10px 0;">${producto.nombre}</h3>
                <p style="font-size:0.9rem; color:#666; height:40px; overflow:hidden;">${producto.descripcion}</p>
                <p>Precio: <strong style="color:#27ae60; font-size:1.1rem;">$${producto.precio.toLocaleString('es-AR')}</strong></p>
            </div>
            <button type="button" class="btn-agregar" style="margin-top:10px; width:100%; padding:10px; background:#e67e22; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                Agregar al carrito
            </button>
        `;
        
        contenedorGrid.appendChild(article);

        const boton = article.querySelector(".btn-agregar") as HTMLButtonElement;
        boton.onclick = () => addToCart(producto);
    });
};

// --- 4. EVENTOS ADICIONALES ---

inputBusqueda?.addEventListener("input", () => {
    const termino = inputBusqueda.value.toLowerCase();
    const filtrados = PRODUCTS.filter(p => p.nombre.toLowerCase().includes(termino));
    cargarproductos(filtrados);
});

function addToCart(producto: any) {
    const carritoActual = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = carritoActual.findIndex((item: any) => item.id === producto.id);

    if (index !== -1) {
        carritoActual[index].cantidad += 1;
    } else {
        carritoActual.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(carritoActual));
    alert(`¡${producto.nombre} se agregó al carrito!`);
}

// Botón de Logout corregido
if (btnLogout) {
    btnLogout.onclick = () => {
        localStorage.removeItem("userData");
        const urlLogin = window.location.origin + "/src/pages/auth/login/login.html";
        window.location.replace(urlLogin);
    };
}

// --- 5. INICIALIZACIÓN ---
cargarcategorias();
cargarproductos(PRODUCTS);