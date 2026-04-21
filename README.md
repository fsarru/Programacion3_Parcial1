# 🍔 Food Store - Programación III (Parcial 1)

Este proyecto es una aplicación dinámica de tienda virtual desarrollada con **Vite** y **TypeScript**, enfocada en la gestión de un catálogo de productos y un carrito de compras con persistencia de datos mediante `localStorage`.

## 🚀 Características Principales

- **Gestión de Estado**: Uso de `localStorage` para mantener los productos en el carrito incluso al recargar la página (Persistencia).
- **UX/UI Dinámica**:
  - Feedback visual al agregar productos.
  - Filtros por categorías en tiempo real.
  - Buscador de productos por nombre.
  - Cabecera y navegación unificada entre el inicio y el carrito.
  
- **Estética**: Uso de la tipografía 'Fredoka' para un diseño moderno, amigable y corporativo en tonos naranjas.

## 📁 Estructura del Proyecto

```text
src/
├── data/
│   └── data.ts          # Fuente de datos (Array de productos y categorías)
├── types/
│   ├── product.ts       # Definición de interfaz de Producto y CartItem
│   └── categoria.ts     # Interfaz para categorías
└── pages/
    └── store/           # Vistas principales de la tienda
        ├── home/        # Catálogo (home.html y home.ts)
        └── cart/        # Carrito de compras (cart.html y cart.ts)
```

## 🛠️ Instalación y Uso
<ins>**1. Clonar el repositorio: git clone**</ins>
```text 
https://github.com/TU_USUARIO/Programacion3_Parcial1.git
```

<ins>**2. Instalar dependencias:**</ins>
```text 
pnpm install 
```

<ins>**3. Iniciar el servidor de desarrollo:**</ins>
```text
pnpm dev 
```

## 🛠️ Tecnologías Utilizadas
- Vite - Frontend Tooling

- TypeScript - Tipado estático

- Google Fonts - Tipografía Fredoka

- Git/GitHub - Control de versiones
