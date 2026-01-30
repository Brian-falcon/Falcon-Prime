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

## Si los productos no aparecen (error de conexión)

1. **Verificar conexión:** Abrí en el navegador **`https://tu-app.vercel.app/api/db-check`**.  
   - Si devuelve `productCount: 0` pero en Neon Studio ves productos → **DATABASE_URL en Vercel no apunta a la misma base** (revisá branch **production** y proyecto en Neon).  
   - Si devuelve error → **DATABASE_URL** falta o está mal (espacios, comillas, URL vieja).

2. **Vercel:** Settings → **Environment Variables** → **`DATABASE_URL`** debe ser **exactamente** la connection string de Neon:  
   - Neon Console → tu proyecto → **Connection string** → **Branch: production** → copiar.  
   - Pegar en Vercel **sin espacios ni comillas**. Asignar a **Production** y **Preview**.  
   - **Redeploy** (Deployments → ⋮ → Redeploy).

3. **Local:** `.env.local` en la raíz con `DATABASE_URL=postgresql://...` (tu URL de Neon).

4. **Cargar productos:** Si la base está vacía: `npm run seed` y luego `npm run seed-products`.

## Imágenes de productos (Cloudinary)

El admin sube imágenes por archivo (PNG, JPG · máx 4 MB) a Cloudinary. Las URLs se guardan en `product_images`.

1. Creá una cuenta en [Cloudinary](https://cloudinary.com) → **Dashboard**.
2. Copiá **Cloud name**, **API Key** y **API Secret**.
3. En **Vercel** → Environment Variables agregá:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Redeploy. Sin estas variables, "Añadir imágenes" en Nuevo/Editar producto fallará.

## Email al cliente (Resend) – opcional

Cuando en Admin → Pedidos cambiás el estado de un pedido a **Enviado**, se envía un email al correo del cliente avisando que su pedido fue despachado.

1. Creá una cuenta en [Resend](https://resend.com) → **API Keys** → Create API Key.
2. En **Vercel** (o `.env.local`) agregá:
   - `RESEND_API_KEY` = tu API key.
   - `EMAIL_FROM` = remitente verificado en Resend, ej: `Falcon Prime <ventas@tudominio.com>` (o dejá el default `onboarding@resend.dev` para pruebas).
3. Si no configurás `RESEND_API_KEY`, el estado se actualiza igual pero no se envía el email.

## Funcionalidades

- **Tienda:** Home, catálogo con filtros (categoría, talle, color, precio), ficha de producto, carrito, checkout.
- **Admin:** Login, CRUD de productos, múltiples imágenes, categorías, talles y stock. El stock se descuenta al confirmar pedido. Gestión de pedidos: cambiar estado (Pendiente → En preparación → Enviado → Entregado); al marcar **Enviado** se envía un email al cliente (si está configurado Resend).

## Licencia

Privado - Falcon Prime.
