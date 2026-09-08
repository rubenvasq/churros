# El Rinconcito — versión Next.js

Reescritura en **Next.js 16 (App Router) + React 19 + TypeScript** de la app de
pedidos "El Rinconcito", originalmente en Laravel. Usa **Prisma 6** sobre
**PostgreSQL** y **Auth.js v5** para la autenticación con roles.

## Stack

- Next.js 16 (App Router, Server Actions)
- Prisma 6.19 (fijado a v6 estable)
- Auth.js v5 (next-auth beta) — login por credenciales, bcrypt compatible con hashes `$2y$` de Laravel
- PostgreSQL
- Tailwind CSS 4
- exceljs (reportes Excel)

## Roles y paneles

| Rol         | Panel          | Qué hace                                                        |
| ----------- | -------------- | -------------------------------------------------------------- |
| —           | `/registro`    | Registro de nuevos clientes (auto-login)                       |
| cliente     | `/cliente`     | Menú con filtros por categoría, carrito, pedidos, reseñas      |
| chef        | `/chef`        | Ve pedidos `en_espera` y los marca como `listo`                |
| repartidor  | `/repartidor`  | Ve pedidos `listo` y los marca como `entregado`                |
| admin       | `/admin`       | CRUD de platos, listado de pedidos, reportes Excel/PDF         |

Ciclo de vida del pedido: `en_espera` → `listo` → `entregado`.

## Puesta en marcha (local)

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Crear el archivo `.env` (ya existe uno de ejemplo). Debe contener:
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST:5432/rinconcito"
   AUTH_SECRET="una-cadena-larga-aleatoria"
   AUTH_URL="http://localhost:3000"
   ```
   Para generar `AUTH_SECRET`: `npx auth secret`.

3. **Configurar la base de datos.** Elige una opción:

   **A) Postgres local con Docker**
   ```bash
   docker run --name rinconcito-db -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=rinconcito -p 5432:5432 -d postgres:16
   # DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rinconcito"
   ```

   **B) Postgres de Render**
   Copia la *External Database URL* del servicio de Postgres en el panel de
   Render y pégala como `DATABASE_URL` (incluye `?sslmode=require`).

4. Crear las tablas a partir del esquema Prisma:
   ```bash
   npx prisma db push        # sincroniza el esquema (sin migraciones)
   npx prisma generate       # genera el cliente (se ejecuta solo tras db push)
   ```

5. Arrancar en desarrollo:
   ```bash
   npm run dev               # http://localhost:3000
   ```

## Migrar los datos desde el Postgres de Render (Laravel)

El esquema Prisma usa **los mismos nombres de tabla y columna** que la app
Laravel (`users`, `platos`, `pedidos`, `resenas`, columnas en español) para que
los datos casen directamente. Opciones para traer los datos:

- **Misma base de datos:** apunta `DATABASE_URL` a la BD de Render que ya usa
  Laravel. Como los nombres coinciden, la app Next.js lee los datos existentes
  tal cual (haz `npx prisma db push` solo si faltan columnas del nuevo esquema;
  revisa antes con `npx prisma migrate diff` para no perder datos).
- **Volcado y restauración:** `pg_dump` de la BD de Render →
  `pg_restore`/`psql` en la BD nueva.

> Ojo con la columna de rol: en Laravel el rol podía ser un `string`; aquí es un
> `enum Role` de Postgres. Si los valores existentes no son exactamente
> `cliente|chef|repartidor|admin`, normalízalos antes de migrar.

## Comandos útiles

```bash
npm run dev            # servidor de desarrollo
npm run build          # build de producción
npm start              # servir el build
npx prisma studio      # explorador visual de la BD
npx tsc --noEmit       # chequeo de tipos
```

## Despliegue en Render (build nativo de Node)

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm start`
- Variables de entorno: `DATABASE_URL` (la inyecta Render), `AUTH_SECRET`,
  `AUTH_URL` (la URL pública `https://…onrender.com`).
- Ejecutar `npx prisma db push` una vez contra la BD de producción (o añadirlo
  al build) para crear las tablas.

## Notas

- **Reportes PDF:** se generan como una vista imprimible (`/admin/reportes/pdf`)
  que el navegador guarda como PDF. Se evitó `dompdf`/librerías binarias para no
  complicar el despliegue en Render.
- **Carrito:** vive en una cookie, no en la BD; solo se escriben filas en
  `pedidos` al confirmar.
- El aviso de build sobre `middleware` → `proxy` es de Next 16; el archivo
  `src/middleware.ts` sigue funcionando (migración opcional).
