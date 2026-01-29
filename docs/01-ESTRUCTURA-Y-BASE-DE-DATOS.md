# Falcon Prime – Estructura del proyecto y base de datos

## 1. Estructura del proyecto

```
Falcon-Prime/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout raíz
│   │   ├── page.tsx            # Página principal (home)
│   │   ├── globals.css         # Estilos globales
│   │   ├── (store)/            # Rutas de la tienda (públicas)
│   │   ├── admin/              # Panel de administración (protegido)
│   │   └── api/                # API Routes
│   ├── components/             # Componentes reutilizables
│   ├── db/                     # Base de datos
│   │   ├── index.ts            # Conexión Drizzle + Neon
│   │   └── schema.ts           # Definición de tablas (Drizzle)
│   └── lib/                    # Utilidades y helpers
│       └── utils.ts
├── scripts/
│   └── schema-neon.sql         # SQL para crear tablas en Neon Console
├── drizzle.config.ts           # Configuración de Drizzle Kit
├── .env.example                # Ejemplo de variables de entorno
└── package.json
```

- **Next.js 14** con App Router: rutas en `src/app/`, layouts y páginas en React.
- **Tailwind CSS** para estilos (clases en `tailwind.config.ts`).
- **Drizzle ORM** para leer/escribir en PostgreSQL (Neon) desde `src/db/`.

## 2. Modelo de base de datos (Neon / PostgreSQL)

La base **Falcon Prime** en Neon tiene estas tablas:

| Tabla            | Uso |
|------------------|-----|
| **categories**   | Categorías de productos: Ropa, Calzado, Accesorios. |
| **products**     | Productos: nombre, slug, descripción, precio, color, categoría, activo. |
| **product_images** | Varias imágenes por producto (URL, orden). |
| **product_sizes**  | Talles por producto con **stock** (se descuenta al vender). |
| **admins**       | Usuarios del panel admin (email + hash de contraseña). |
| **orders**       | Pedidos: email, nombre, teléfono, dirección, total, estado. |
| **order_items**  | Líneas del pedido: producto, talle, cantidad, precio. |

### Relaciones principales

- Un **producto** pertenece a una **categoría** y tiene muchas **imágenes** y muchos **product_sizes** (talle + stock).
- Un **pedido** tiene muchos **order_items**; cada ítem referencia producto, talle y cantidad.
- El **stock** se descuenta en **product_sizes** cuando se confirma un pedido (no se permite comprar si no hay stock).

### Cómo crear las tablas en Neon

**Opción A – Desde Neon Console**

1. En [Neon Console](https://console.neon.tech), abre tu proyecto y la base **Falcon Prime**.
2. En **SQL Editor**, pega y ejecuta el contenido del archivo `scripts/schema-neon.sql`.

**Opción B – Desde el proyecto (Drizzle)**

1. Crea `.env.local` con tu `DATABASE_URL` de Neon (la misma que usas en Vercel).
2. En la raíz del proyecto: `npm run db:push`.
3. Drizzle creará/actualizará las tablas según `src/db/schema.ts`.

**Seed inicial (categorías + admin)**  
Con las tablas creadas y `DATABASE_URL` en `.env.local`, ejecuta:

```bash
npm run seed
```

Crea las categorías Ropa, Calzado y Accesorios, y un usuario admin con `ADMIN_EMAIL` y `ADMIN_PASSWORD` (por defecto `admin@falconprime.com` / `admin123`). Luego puedes entrar en `/admin/login`.

Después de tener las tablas y el seed, el **panel de administrador** permite login, CRUD de productos, múltiples imágenes por URL, talles y stock.
