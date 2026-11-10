# Cuentas Claras

*Cuentas claras conservan la amistad.*

App personal para el celular: gastos, cuotas, deudas e inversiones, en pesos y dólares.
Todo se guarda en el teléfono, funciona sin internet y no hace falta pasar por la App Store.

## Archivos
- `index.html`: la app completa (diseño + lógica)
- `sw.js`: hace que funcione offline. **Cuando cambies algo, subí la versión** (`finanzas-v10` → `finanzas-v11`) y también `VERSION_APP` en `index.html`, que se ve en Ajustes
- `manifest.webmanifest`: nombre, ícono y colores de la app
- `icons/`: ícono de la app y de la pestaña (`favicon.svg` cambia con el modo claro/oscuro)
- `fonts/`: las letras Space Mono y Space Grotesk (licencia OFL, se pueden usar libremente)

## Publicarla con GitHub Pages
1. Subí estos archivos a un repo
2. En el repo: Settings → Pages → Branch `main`, carpeta `/ (root)` → Save
3. En un minuto queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

## Instalarla en el iPhone
1. Abrí el link en **Safari**
2. Tocá el botón Compartir (el cuadrado con la flecha)
3. Elegí "Agregar a pantalla de inicio"
