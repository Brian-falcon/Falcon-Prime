-- ============================================================
-- Falcon Prime - Reset completo de base de datos (Neon)
-- ============================================================
-- Ejecutá TODO este archivo en Neon Console → SQL Editor.
-- Borra todas las tablas, las recrea e inserta categorías + admin.
-- Credenciales admin: admin@falconprime.com / admin123
-- ============================================================

-- 1) Borrar tablas (orden: primero las que tienen FK a otras)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_sizes;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;

-- 2) Extensión para contraseña hasheada (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3) Categorías
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 4) Productos
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  color VARCHAR(50),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 5) Imágenes de productos
CREATE TABLE product_images (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 6) Talles y stock por producto
CREATE TABLE product_sizes (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(20) NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 7) Administradores
CREATE TABLE admins (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 8) Pedidos
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 9) Ítems de pedido
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 10) Índices
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 11) Categorías iniciales (7 categorías)
INSERT INTO categories (id, name, slug) VALUES
  (gen_random_uuid()::text, 'Ropa', 'ropa'),
  (gen_random_uuid()::text, 'Calzado', 'calzado'),
  (gen_random_uuid()::text, 'Accesorios', 'accesorios'),
  (gen_random_uuid()::text, 'Hombre', 'hombre'),
  (gen_random_uuid()::text, 'Mujer', 'mujer'),
  (gen_random_uuid()::text, 'Niños', 'ninos'),
  (gen_random_uuid()::text, 'Deportes', 'deportes');

-- 12) Admin inicial (contraseña: admin123)
INSERT INTO admins (id, email, password_hash, name) VALUES
  ('admin-001', 'admin@falconprime.com', crypt('admin123', gen_salt('bf')), 'Admin');

-- ============================================================
-- Listo. Credenciales: admin@falconprime.com / admin123
-- Si el login no funciona, en tu PC ejecutá: npm run reset-admin
-- ============================================================
