# Tarea 2 - API Copa Mundial FIFA

API REST desarrollada con **Node.js**, **Express**, **SQLite** y **Zod** que expone informacion sobre distintas ediciones de la Copa Mundial de la FIFA.

## Requisitos

- [Node.js](https://nodejs.org/) 22 o superior (modulo `node:sqlite` integrado)
- pnpm

## Instalacion

```bash
pnpm install
```

## Poblar la base de datos

El script lee `datos/mundiales.json` y crea o actualiza `datos/mundiales.db`:

```bash
pnpm run poblar
```

## Ejecutar la API

```bash
pnpm start
```

La API queda disponible en `http://localhost:4321`.

Para desarrollo con recarga automatica:

```bash
pnpm run dev
```

## Rutas disponibles

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Informacion general de la API |
| GET | `/mundiales` | Lista resumida de ediciones |
| GET | `/mundiales?include=full` | Lista con todos los campos |
| GET | `/mundial/:slug` | Detalle de una edicion |
| GET | `/campeon/:pais` | Slugs ganados por un pais |
| GET | `/random` | Una edicion al azar |
| GET | `/search/:text` | Busqueda por texto (minimo 3 caracteres) |
| GET | `/imagenes/:archivo` | Imagenes estaticas de cada mundial |

## Codigos de respuesta

| Codigo | Significado |
|--------|-------------|
| 200 | OK - Peticion exitosa |
| 400 | Bad Request - Validacion Zod fallida |
| 404 | Not Found - Recurso o ruta inexistente |

## Pruebas con httpie o xh

Con el servidor en ejecucion:

```bash
xh GET :4321/mundiales
xh GET :4321/mundiales include==full
xh GET :4321/mundial/qatar-2022
xh GET :4321/mundial/inexistente
xh GET :4321/campeon/Argentina
xh GET :4321/random
xh GET :4321/search/final
xh GET :4321/search/ab
```

Equivalente con httpie:

```bash
http GET :4321/mundiales
http GET :4321/mundiales include==full
```

## Estructura del proyecto

```
Tarea2-C25775/
├── datos/
│   ├── mundiales.json      # Datos iniciales
│   └── mundiales.db        # Base SQLite (generada)
├── public/
│   └── imagenes/           # Imagenes de cada edicion
├── scripts/
│   └── poblar.js           # Script para poblar la BD
├── src/
│   ├── app.js              # Configuracion de Express
│   ├── db.js               # Conexion SQLite
│   ├── index.js            # Punto de entrada
│   ├── middleware/
│   │   └── errores.js      # Respuestas de error
│   ├── routes/
│   │   ├── index.js        # Ruta /
│   │   └── mundiales.js    # Rutas del recurso
│   └── schemas/
│       └── validaciones.js # Esquemas Zod
├── README.md
└── REFERENCIAS.md
```

## Autor

C25775 Gerald Paladino Alvarez
