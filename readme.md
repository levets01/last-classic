Actúa como un Desarrollador Frontend Senior / Creative Technologist especializado en e-commerce de moda de lujo y diseño interactivo de alta gama.

OBJETIVO PRINCIPAL:
Completar y elevar al máximo nivel la experiencia de usuario (UX/UI) del frontend para la tienda en línea "LAST CLASSIC — FASHION" en un entorno Vite (`src/index.html`, `src/style.css`, `src/main.js`). El sitio debe ser ultra elegante, fluido, interactivo y contar con animaciones sutiles tipo tienda de lujo (estilo Jacquemus, Zara o Saint Laurent).

--------------------------------------------------
1. DISEÑO VISUAL & PALETA DE COLORES:
--------------------------------------------------
- Estética minimalista, sofisticada y limpia.
- Paleta: Blanco puro (`#FFFFFF`), Negro azabache (`#111111`), Gris neutro muy claro (`#F9F9F9`), Texto secundario (`#666666`).
- Tipografías: 'Bodoni Moda' para títulos/logos y 'Montserrat' para textos, menú y botones.
- Mantener el Header con el logo `LAST CLASSIC` matemáticamente centrado mediante CSS Grid (`1fr 1fr 1fr`).

--------------------------------------------------
2. ANIMACIONES & MICRO-INTERACCIONES (SÚPER FLUIDAS):
--------------------------------------------------
- CSS Animations & Transitions:
  * Fade-in & Slide-up al hacer scroll (efecto reveal en tarjetas de productos, categorías y hero).
  * Hover en tarjetas de producto: Zoom suave en la imagen (`transform: scale(1.05)` con `transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`), desplazamiento sutil del botón "Añadir al Carrito".
  * Animación en el Badge del Carrito: Micro-rebote/pulso (`keyframes bounce`) cada vez que se agrega un producto.
  * Línea indicadora bajo los enlaces del menú que se desplaza suavemente al hacer hover.
  * Transición suave para cambiar entre la foto principal y una secundaria al pasar el cursor sobre un producto (efecto hover flip/fade).
  * Menú hamburguesa móvil con animación suave de apertura de panel lateral (Drawer / Off-canvas).

--------------------------------------------------
3. ESTRUCTURA DE SECCIONES EN EL HTML:
--------------------------------------------------
1. TOP BAR & HEADER:
   - Anuncio superior con íconos de Lucide.
   - Header de 3 columnas con buscador animado (expansible al hacer focus), logo centrado e íconos interactivos.
   - Menú de navegación sticky/fijo al hacer scroll hacia abajo con un fondo ligeramente translúcido (`backdrop-filter: blur(10px)`).

2. HERO BANNER PRINCIPAL (SECCIÓN IMPACTANTE):
   - Título tipográfico grande: "Un pantalón, Diferentes estilos."
   - Subtítulo: "COMODIDAD / ELEGANCIA / VERSATILIDAD".
   - Botón call-to-action "VER COLECCIÓN →" con efecto de rellenado fluido en hover.
   - Contenedor para FOTO DE BANNER HERO con overlay oscuro sutil.

3. GRID DE CATEGORÍAS (DESTACADOS):
   - Tarjetas para "Pantalones", "Camisas", "Camisetas", "Accesorios".
   - Cada tarjeta debe tener un zoom elegante al pasar el mouse.

4. CATÁLOGO DE PRODUCTOS (GRID CON FILTROS):
   - Pestañas/Filtros dinámicos ("Todos", "Novedades", "Pantalones", "Lo más vendido") con transición de filtrado en JS.
   - Tarjetas de producto completas con:
     * Contenedor de FOTO con aspect-ratio 3/4.
     * Etiquetas/Badges ("NUEVO", "AGOTADO", "DESCUENTO").
     * Botón flotante rápido "Añadir al Carrito" (+ animación).
     * Precio, título y selector de tallas (S, M, L, XL) interactivo.

5. SECCIÓN DE ESTILO DE VIDA / LOOKBOOK:
   - Banner interactivo de la filosofía "LAST CLASSIC" con distribución asimétrica (Texto + Imagen).

6. FOOTER COMPLETO:
   - Formulario Newsletter con validación en JS y mensaje de éxito animado.
   - Enlaces de navegación, redes sociales con hover interactivo y métodos de pago.

--------------------------------------------------
4. MARCADORES / PLACEHOLDERS PARA FOTOS:
--------------------------------------------------
- Cada espacio de imagen debe tener un contenedor estructurado con una imagen limpia de Unsplash Moda / Minimalismo de alta calidad (ej. `https://images.unsplash.com/...`).
- Añadir comentarios HTML muy claros indicando exactamente dónde reemplazar las rutas:
  `<!-- 📸 FOTO PRODUCTO: Reemplaza src por '/src/assets/tu-imagen.jpg' -->`

--------------------------------------------------
5. LÓGICA JAVASCRIPT (`src/main.js`):
--------------------------------------------------
- Inicialización limpia de `lucide-static` o `lucide`.
- Contador del carrito con almacenamiento local (`localStorage`) para persisitir los ítems.
- Drawer/Panel lateral deslizante interactivo para ver el resumen del Carrito cuando se hace clic en la bolsa.
- Filtro funcional de productos según la categoría seleccionada sin recargar la página.
- Interceptor del buscador que filtra las tarjetas de productos visibles en tiempo real.
- IntersectionObserver para disparar las animaciones de scroll automáticamente cuando el usuario navega por la página.

Por favor, genera y actualiza los archivos `src/index.html`, `src/style.css` y `src/main.js` con este estándar profesional, limpio, moderno y completamente funcional.