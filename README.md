# Sistema de Gestión - Frontend Angular

Aplicación Angular para gestionar Personas y Productos, conectada a una API Django REST.

## Requisitos

- Node.js 18+
- npm 9+
- Angular CLI 20.x

## Instalación

```bash
npm install
```

## Configuración

### Configurar API Backend

configuracion de la URL de la API:

**src/environments/environment.ts** (desarrollo):
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.maestriaia.com/api/v1'
```

**src/environments/environment.prod.ts** (producción):
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.maestriaia.com/api/v1'  // URL de producción
};
```

## Ejecución en Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## Build de Producción

Para generar el build optimizado:

```bash
npm run build
```

Los archivos compilados se generarán en el directorio `dist/demo/browser/`

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes de la aplicación
│   │   ├── person-list/      # Listado de personas
│   │   ├── person-form/      # Formulario de personas
│   │   ├── product-list/     # Listado de productos
│   │   └── product-form/     # Formulario de productos
│   ├── models/               # Interfaces TypeScript
│   │   ├── person.model.ts
│   │   └── product.model.ts
│   ├── services/             # Servicios para API
│   │   ├── person.service.ts
│   │   └── product.service.ts
│   ├── interceptors/         # Interceptores HTTP
│   │   └── error.interceptor.ts
│   ├── app.component.*       # Componente principal y layout
│   └── app.routes.ts         # Configuración de rutas
├── environments/             # Configuración por entorno
└── main.ts                   # Punto de entrada

```

## Funcionalidades

### Gestión de Personas

- Listar personas con paginación
- Filtrar por email y apellido
- Ordenar por diferentes campos
- Crear nueva persona
- Editar persona existente
- Eliminar persona (con confirmación)

### Gestión de Productos

- Listar productos con paginación
- Filtrar por SKU y rango de precio
- Búsqueda por nombre
- Ordenar por diferentes campos
- Crear nuevo producto
- Editar producto existente
- Eliminar producto (con confirmación)
- Asignar propietario (persona) a un producto

## Rutas de la Aplicación

- `/persons` - Listado de personas
- `/persons/new` - Crear nueva persona
- `/persons/:id/edit` - Editar persona
- `/products` - Listado de productos
- `/products/new` - Crear nuevo producto
- `/products/:id/edit` - Editar producto

## Validaciones de Formularios

### Persona
- **Nombre**: requerido, 1-100 caracteres
- **Apellido**: requerido, 1-100 caracteres
- **Email**: requerido, formato válido

### Producto
- **Nombre**: requerido, 1-150 caracteres
- **SKU**: requerido, 3-50 caracteres
- **Precio**: requerido, numérico, >= 0
- **Propietario**: opcional

## Manejo de Errores

La aplicación incluye un interceptor HTTP que:
- Captura errores 4xx/5xx
- Muestra mensajes amigables al usuario
- Registra errores en la consola para debugging

## Características Técnicas

- **Angular 20** con standalone components
- **Formularios reactivos** con validaciones
- **HttpClient** para consumir API REST
- **RxJS** para manejo de estado
- **Router** con lazy loading
- **Interceptores** para manejo de errores
- **Responsive design** con CSS moderno
- **TypeScript** para type safety


## Notas de Desarrollo

- Nunca hardcodee URLs de API en componentes, use siempre `environment.ts`
- Los servicios manejan toda la comunicación con la API
- El código sigue las convenciones de Angular y TypeScript
- Se implementan loading states y empty states para mejor UX

## Soporte

Para problemas o preguntas sobre el backend Django, consulte la documentación de la API en:
- http://api.maestriaia.com/api/docs/
"# desafio-frontend" 
