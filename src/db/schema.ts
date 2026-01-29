/**
 * Falcon Prime - Schema de base de datos (PostgreSQL / Neon)
 *
 * Tablas:
 * - categories: categorías de productos (ropa, calzado, accesorios)
 * - products: productos con precio, descripción, stock
 * - product_images: múltiples imágenes por producto
 * - product_sizes: talles disponibles por producto (con stock por talle)
 * - admins: usuarios administradores para el panel
 * - orders: pedidos (para checkout y futuro pago)
 * - order_items: líneas de cada pedido
 */

import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Categorías ---
export const categories = pgTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Productos ---
export const products = pgTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),
  categoryId: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  color: varchar("color", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Imágenes de productos (múltiples por producto) ---
export const productImages = pgTable("product_images", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Talles y stock por producto ---
export const productSizes = pgTable("product_sizes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  size: varchar("size", { length: 20 }).notNull(), // "S", "M", "L", "XL", "42", etc.
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Administradores (login panel admin) ---
export const admins = pgTable("admins", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Pedidos (checkout) ---
export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: text("shipping_address").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Ítems de cada pedido ---
export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 36 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  size: varchar("size", { length: 20 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relaciones Drizzle (para queries con join) ---
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories),
  images: many(productImages),
  sizes: many(productSizes),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products),
}));

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders),
}));
