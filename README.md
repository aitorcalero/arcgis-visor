# Visor ArcGIS

Visor web de España con Vite, TypeScript, Calcite Design System y los componentes web de ArcGIS Maps SDK for JavaScript 4.34. No utiliza React ni servidor propio.

## Inicio

Requiere Node.js 20.19+ o 22.12+ y npm.

```powershell
cd C:\7_CODE\arcgis-visor
npm install
npm run dev
```

Abre la URL local que muestra Vite. Para generar y revisar la versión de producción:

```powershell
npm run build
npm run preview
```

La aplicación está configurada para GitHub Pages bajo `/arcgis-visor/`. Los cambios enviados a la rama `main` se publican mediante el flujo de GitHub Actions de `.github/workflows/deploy.yml`; el origen de Pages debe estar configurado como **GitHub Actions**. Si se cambia el nombre del repositorio, actualiza `base` en `vite.config.ts`.

El mapa incluye búsqueda, zoom, extensión inicial, brújula, lista de capas, leyenda, galería de mapas base y cambio de tema. La barra lateral se puede contraer; en pantallas pequeñas se superpone al mapa. La capa de ciudades es un ejemplo local editable en `src/main.ts`, no un conjunto exhaustivo.

El mapa base, la búsqueda y la galería acceden a servicios de Esri y requieren conexión a Internet. Según el servicio, su uso puede requerir autenticación, permisos o una clave de API y puede estar sujeto a límites y costes. No hay credenciales en el proyecto: si se incorporan servicios protegidos, configura autenticación adecuada y evita incluir secretos en código cliente. Vite expone al navegador cualquier variable `VITE_`.

El visor muestra un aviso si falla el inicio o la carga del mapa base y registra los detalles en la consola del navegador. La disponibilidad de servicios externos y los errores de red también pueden consultarse en las herramientas de desarrollo.

Documentación: [ArcGIS con Vite](https://developers.arcgis.com/javascript/latest/vite/) y [Calcite Design System](https://developers.arcgis.com/calcite-design-system/).
