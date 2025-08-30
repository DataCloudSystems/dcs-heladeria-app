# dcs-heladeria-app

## Estructura de assets

- CSS
  - `views/assets/css/variables.css`: design tokens (colores, gradientes, sombras)
  - `views/assets/css/style.css`: agregador con `@import` de componentes
  - `views/assets/css/components/`: estilos por módulo
    - `base.css`, `navigation.css`, `hero.css`, `section.css`, `products.css`,
      `features.css`, `stats.css`, `footer.css`, `loading.css`, `currency.css`,
      `animations.css`, `progress.css`, `modal.css`, `toast.css`, `responsive.css`
  - `views/assets/css/style.legacy.css`: copia de referencia previa a la modularización

- JS
  - `views/assets/js/config.js`: moneda, helpers y actualización de precios
  - `views/assets/js/products.js`: catálogo y render de modal de producto
  - `views/assets/js/cart.js`: carrito y flujo “pagar en caja”
  - `views/assets/js/ui.js`: animaciones (AOS/GSAP), scroll, counters y mejoras UI

## Notas
- Mantén `variables.css` linkeado antes de `style.css` en `index.html`.
- Evita estilos inline en HTML; usa las clases existentes.
- Si agregas un nuevo módulo CSS, añádelo como `@import` en `style.css`.
