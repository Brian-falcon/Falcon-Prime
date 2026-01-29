# Falcon Prime

Tienda online de moda (ropa, calzado, accesorios) con diseño minimalista y profesional. Inspirada en el estilo visual de tiendas premium, con identidad propia.

## Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Base de datos:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Deploy:** Vercel (recomendado)

## Requisitos

- Node.js 18+
- Cuenta en [Neon](https://neon.tech) y [Vercel](https://vercel.com)
- Variables de entorno (ver `.env.example`)

## Instalación

```bash
# Clonar e instalar dependencias
cd Falcon-Prime
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL de Neon y opcionalmente ADMIN_EMAIL / ADMIN_PASSWORD
```

## Base de datos (Neon)

1. En [Neon Console](https://console.neon.tech), crea un proyecto y copia la **connection string**.
2. Ponla en `.env.local` como `DATABASE_URL`.
3. Crear tablas:
   - **Opción A:** En Neon Console → SQL Editor, pega y ejecuta el contenido de `scripts/schema-neon.sql`.
   - **Opción B:** Con `DATABASE_URL` en `.env.local`, ejecuta `npm run db:push`.

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm run dev`  | Servidor de desarrollo         |
| `npm run build`| Build para producción          |
| `npm run start`| Servidor de producción         |
| `npm run db:push`   | Sincronizar schema con Neon   |
| `npm run db:studio` | Abrir Drizzle Studio (UI DB) |
| `npm run seed`      | Crear categorías y admin inicial (requiere .env.local) |

## Estructura del proyecto

```
Falcon-Prime/
├── src/
│   ├── app/              # Rutas Next.js (App Router)
│   │   ├── (store)/      # Tienda pública
│   │   ├── admin/        # Panel de administración
│   │   └── api/          # API Routes
│   ├── components/       # Componentes reutilizables
│   ├── db/               # Schema y conexión Drizzle
│   └── lib/              # Utilidades, validaciones
├── scripts/
│   └── schema-neon.sql   # Schema SQL para Neon
├── drizzle.config.ts
└── package.json
```

## Si los productos no aparecen en el sitio

1. **Vercel:** En el proyecto → **Settings** → **Environment Variables**, agregá **`DATABASE_URL`** con la connection string de Neon (la misma que usás en Neon Console). Asignala a **Production** y **Preview**. Luego **Redeploy** (Deployments → ⋮ → Redeploy).
2. **Local:** Verificá que `.env.local` exista en la raíz del proyecto y tenga `DATABASE_URL=postgresql://...` (tu URL de Neon).
3. **Cargar productos:** Si la base está vacía, ejecutá `npm run seed` y después `npm run seed-products`.

## Funcionalidades

- **Tienda:** Home, catálogo con filtros (categoría, talle, color, precio), ficha de producto, carrito, checkout.
- **Admin:** Login, CRUD de productos, múltiples imágenes, categorías, talles y stock. El stock se descuenta al confirmar pedido.

## Licencia

Privado - Falcon Prime.
