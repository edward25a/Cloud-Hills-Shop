# Cloud Hills Shop - Tienda Online

Prototipo estático para una tienda online de ropa con catálogo por secciones, precios, detalle de producto y pedido por WhatsApp.

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: diseño responsive.
- `app.js`: productos, filtros, carrito y enlace de WhatsApp.

## Cambios comunes

Para cambiar el número de WhatsApp, edita `WHATSAPP_NUMBER` en `app.js`.

Para agregar o modificar productos, edita el arreglo `products` en `app.js`.

## Panel del dueño

Abre `admin.html` para entrar al panel privado del dueño.

Clave de prueba:

```txt
cloudhills2019
```

Desde ese panel puedes:

- Subir fotos de ropa.
- Agregar productos.
- Editar nombre, sección, precio, tallas, stock y descripción.
- Eliminar productos.
- Ver la tienda pública en otra pestaña.

Nota: esta clave funciona para el prototipo local. Cuando la tienda se suba a internet, lo correcto es crear un login real con backend y base de datos para que solo el dueño pueda cambiar el catálogo de forma segura.

## Firebase para recibir pedidos

Edita `firebase-config.js` y reemplaza los valores que dicen `PEGA_AQUI...` por los datos reales de tu proyecto de Firebase.

La tienda pública guarda los pedidos en:

```txt
pedidos
```

El panel del dueño lee esos pedidos en vivo desde `admin.html`.

Para que funcione, en Firebase debes tener activada una Realtime Database. En modo de prueba puedes usar reglas abiertas mientras desarrollas, pero para publicar la tienda hay que crear reglas seguras y login real para el dueño.
