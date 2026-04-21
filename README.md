# 🍔 Food Store - Programación III (Parcial 1)

Este proyecto es una aplicación dinámica de tienda virtual desarrollada con **Vite**, **TypeScript** y **Sass/CSS**, enfocada en la gestión de un catálogo de productos y un carrito de compras con persistencia de datos.

## 🚀 Características Principales

- **Gestión de Estado**: Uso de `localStorage` para mantener los productos en el carrito incluso al recargar la página.
- **Seguridad y Ruteo**: Implementación de protección de rutas para evitar el acceso a la tienda o al carrito sin una sesión activa.
- **UX/UI Dinámica**:
  - Feedback visual al agregar productos (animación del botón sin alertas bloqueantes).
  - Filtros por categorías en tiempo real.
  - Buscador de productos inteligente.
  - Cabecera y navegación unificada con diseño profesional.
- **Tipografía**: Uso de 'Fredoka' para una estética moderna y amigable.

## 📁 Estructura del Proyecto

Siguiendo las consignas del parcial, la estructura se organiza de la siguiente manera:

```text
src/
├── data/
│   └── data.ts          # Fuente de datos (PRODUCTS y Categorías)
├── types/
│   ├── product.ts       # Interfaces de Producto y CartItem
│   └── categoria.ts     # Interface ICategory
└── pages/
    ├── auth/            # Login y Registro
    ├── admin/           # Panel de administración (en desarrollo)
    └── store/           # Vistas del cliente
        ├── home/        # Catálogo principal
        └── cart/        # Vista detallada del carrito
```

## 🛠️ Instalación y Uso
1. Clonar el repositorio: 
git clone [https://github.com/TU_USUARIO/Programacion3_Parcial1.git](https://github.com/TU_USUARIO/Programacion3_Parcial1.git)

2. Instalar dependencias:
pnpm install

3. Iniciar el servidor de desarrollo:
pnpm dev

## 👤 Usuarios de Prueba
Para testear la protección de rutas y el ruteo dinámico:

Cliente: cliente@cliente.com / password123

## 🛠️ Tecnologías Utilizadas
Vite - Frontend Tooling

TypeScript - Tipado estático

Google Fonts - Tipografía Fredoka

Git/GitHub - Control de versiones