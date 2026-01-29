/**
 * Script: inserta 320+ productos en todas las categorías (Ropa, Calzado, Accesorios, Hombre, Mujer, Niños, Deportes).
 * Ejecutar con: npm run seed-products
 * Requiere DATABASE_URL en .env.local y que existan las categorías (ejecutar npm run seed antes si no).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { generateId, slugify } from "../src/lib/utils";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL en .env.local");
  process.exit(1);
}

// --- Nombres por categoría ---
const ROPA = [
  "Remera básica algodón", "Camisa Oxford", "Jean slim fit", "Pantalón chino", "Sweater de lana",
  "Blazer clásico", "Short de vestir", "Pollera midi", "Vestido casual", "Campera bomber",
  "Buzo canguro", "Pantalón jogger", "Camisa manga larga", "Remera polo", "Cardigan",
  "Pantalón cargo", "Top crop", "Falda plisada", "Chaqueta denim", "Remera oversize",
  "Pantalón wide leg", "Body básico", "Sweater cuello alto", "Jean mom fit", "Blusa seda",
  "Short denim", "Vestido midi", "Camisa flannel", "Pantalón palazzo", "Campera parka",
  "Remera rayas", "Pantalón recto", "Sweater cardigan", "Jean high waist", "Top mangas largas",
];

const CALZADO = [
  "Zapatilla urbana", "Zapato mocasín", "Bota chelsea", "Sandalias cuero", "Zapatilla running",
  "Alpargata clásica", "Zapato Oxford", "Bota militar", "Mocasín driver", "Zapatilla slip-on",
  "Sandalia plataforma", "Zapato monk", "Bota ankle", "Zapatilla lifestyle", "Mule",
  "Zapato derby", "Chancla slide", "Bota de lluvia", "Zapatilla low", "Loafer",
  "Zapato taco bajo", "Zapatilla high top", "Sandalia taco", "Bota western", "Espadrille",
  "Zapato ballet", "Zapatilla trail", "Mocasín tassel", "Bota sueca", "Zapato taco medio",
  "Zapatilla minimal", "Sandalia gladiadora", "Zapato smoking", "Bota combate", "Slip-on canvas",
];

const ACCESORIOS = [
  "Cinturón cuero", "Cartera crossbody", "Riñonera", "Gorra baseball", "Bufanda lana",
  "Lentes de sol", "Reloj minimal", "Bolso tote", "Cinturón tela", "Mochila urbana",
  "Gorra trucker", "Pañuelo seda", "Billetera cuero", "Bolso bandolera", "Gorra beanie",
  "Collar minimal", "Pulsera cuero", "Bolso bucket", "Cinturón reversible", "Lentes ópticos",
  "Mochila laptop", "Cartera clutch", "Sombrero panamá", "Reloj deportivo", "Bandolera cuero",
  "Gorra dad cap", "Bufanda infinity", "Bolso messenger", "Cinturón hebilla", "Lentes de lectura",
  "Riñonera cuero", "Cartera larga", "Gorra snapback", "Pañuelo cabeza", "Bolso shopper",
];

const HOMBRE = [
  "Camisa formal hombre", "Pantalón de vestir", "Remera básica hombre", "Saco sport", "Jean clásico hombre",
  "Chomba hombre", "Pantalón gabardina", "Campera de cuero", "Sweater cuello V", "Short bermuda",
  "Blazer hombre", "Pantalón cargo hombre", "Remera manga larga", "Camisa a cuadros", "Buzo con capucha",
  "Pantalón jogger hombre", "Camisa slim fit", "Chaqueta bomber hombre", "Polo hombre", "Pantalón cintura alta",
  "Remera polo hombre", "Sweater rompevientos", "Jean regular fit", "Camisa popelín", "Campera denim hombre",
  "Pantalón drill", "Remera oversize hombre", "Cardigan hombre", "Short chino", "Blazer tres botones",
  "Camisa oxford hombre", "Pantalón elástico", "Buzo básico", "Camisa lino", "Jean stretch",
];

const MUJER = [
  "Blusa manga corta", "Vestido midi mujer", "Pollera tableada", "Remera mujer", "Pantalón palazzo mujer",
  "Top escote V", "Vestido largo", "Jean high waist mujer", "Blusa seda mujer", "Short high waist",
  "Cardigan mujer", "Falda midi", "Remera crop", "Vestido casual mujer", "Pantalón wide leg mujer",
  "Blusa volados", "Pollera denim", "Body mujer", "Camisa oversize mujer", "Vestido florido",
  "Pantalón jogger mujer", "Top deportivo mujer", "Falda plisada mujer", "Remera básica mujer", "Vestido cóctel",
  "Blusa cuello barco", "Jean mom fit mujer", "Sweater mujer", "Short mujer", "Vestido slip",
  "Blusa manga larga", "Pantalón recto mujer", "Top crop mujer", "Vestido wrap", "Pollera corta",
];

const NINOS = [
  "Remera infantil", "Pantalón niño", "Vestido niña", "Buzo niño", "Short infantil",
  "Pollera niña", "Camisa niño", "Jean infantil", "Vestido niña casual", "Campera niño",
  "Remera niña", "Pantalón jogger niño", "Sweater infantil", "Falda niña", "Chomba niño",
  "Pantalón corderoy niño", "Vestido fiesta niña", "Camisa niño manga larga", "Buzo niña", "Short niña",
  "Remera estampada niño", "Pantalón deportivo niño", "Vestido verano niña", "Campera niña", "Jean niño",
  "Blusa niña", "Pantalón elástico niño", "Remera manga larga niño", "Vestido casual niña", "Sweater niña",
  "Pantalón niño cargo", "Remera polo niño", "Falda tableada niña", "Camisa niño cuadros", "Body niña",
];

const DEPORTES = [
  "Remera running", "Short deportivo", "Calza deportiva", "Buzo deportivo", "Top deportivo",
  "Pantalón jogger deportivo", "Remera dry fit", "Short running", "Calza larga", "Campera deportiva",
  "Remera manga larga running", "Short ciclista", "Calza corta", "Buzo con capucha deportivo", "Top crop deportivo",
  "Pantalón térmico", "Remera compresión", "Short básico deportivo", "Calza alta cintura", "Rompevientos",
  "Remera trail", "Short trail", "Calza con bolsillos", "Buzo liviano", "Top mangas largas deportivo",
  "Pantalón deportivo", "Remera ciclismo", "Short gym", "Calza 3/4", "Chaqueta softshell",
  "Remera básica deportiva", "Short futbol", "Calza running", "Buzo running", "Top running",
];

const COLORES = ["Negro", "Blanco", "Gris", "Azul marino", "Beige", "Azul", "Verde", "Rojo", "Navy", "Camel", "Terracota", "Crudo", "Rosa", "Bordó", "Verde militar"];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Item = { name: string; categoryId: string; minPrice: number; maxPrice: number; sizes: string[] };

async function seedProducts() {
  const sql = neon(connectionString!);
  const db = drizzle(sql, { schema });

  const cats = await db.select({ id: schema.categories.id, slug: schema.categories.slug }).from(schema.categories);
  const catBySlug: Record<string, string> = {};
  for (const c of cats) catBySlug[c.slug] = c.id;

  const slugs = ["ropa", "calzado", "accesorios", "hombre", "mujer", "ninos", "deportes"];
  for (const slug of slugs) {
    if (!catBySlug[slug]) {
      console.error(`Falta categoría "${slug}". Ejecutá primero: npm run seed`);
      process.exit(1);
    }
  }

  // Slugs que ya existen en la DB (consulta directa para evitar diferencias de formato)
  const existingRows = await sql`SELECT slug FROM products`;
  const existingSlugs = new Set(
    (Array.isArray(existingRows) ? existingRows : []).map((r: { slug: string }) => String(r.slug ?? "").trim()).filter(Boolean)
  );
  console.log(`Hay ${existingSlugs.size} productos ya cargados en la base. Se omitirán si coinciden.`);
  const usedSlugs = new Set<string>();
  const IMG_BASE = "https://picsum.photos/seed/";

  const configs: { slug: keyof typeof catBySlug; names: string[]; count: number; minPrice: number; maxPrice: number; sizes: string[] }[] = [
    { slug: "ropa", names: ROPA, count: 55, minPrice: 4500, maxPrice: 35000, sizes: ["S", "M", "L", "XL"] },
    { slug: "calzado", names: CALZADO, count: 50, minPrice: 8000, maxPrice: 45000, sizes: ["38", "39", "40", "41", "42", "43"] },
    { slug: "accesorios", names: ACCESORIOS, count: 45, minPrice: 2000, maxPrice: 22000, sizes: ["Único"] },
    { slug: "hombre", names: HOMBRE, count: 55, minPrice: 5000, maxPrice: 38000, sizes: ["S", "M", "L", "XL"] },
    { slug: "mujer", names: MUJER, count: 55, minPrice: 4500, maxPrice: 36000, sizes: ["S", "M", "L", "XL"] },
    { slug: "ninos", names: NINOS, count: 45, minPrice: 2500, maxPrice: 18000, sizes: ["2", "4", "6", "8", "10", "12"] },
    { slug: "deportes", names: DEPORTES, count: 55, minPrice: 4000, maxPrice: 28000, sizes: ["S", "M", "L", "XL"] },
  ];

  const items: Item[] = [];
  for (const cfg of configs) {
    const categoryId = catBySlug[cfg.slug];
    const sizes = Array.isArray(cfg.sizes) ? cfg.sizes : [cfg.sizes];
    for (let i = 0; i < cfg.count; i++) {
      const name = cfg.names[i % cfg.names.length] + " " + random(COLORES);
      items.push({
        name,
        categoryId,
        minPrice: cfg.minPrice,
        maxPrice: cfg.maxPrice,
        sizes: sizes as string[],
      });
    }
  }

  let inserted = 0;
  for (const item of items) {
    const baseSlug = slugify(item.name);
    if (existingSlugs.has(baseSlug)) continue; // ya existe en la DB, omitir
    let slug = baseSlug;
    let n = 0;
    while (usedSlugs.has(slug) || existingSlugs.has(slug)) {
      n++;
      slug = `${baseSlug}-${n}`;
    }
    usedSlugs.add(slug);
    existingSlugs.add(slug);

    const productId = generateId();
    const price = Math.round(randomInt(item.minPrice, item.maxPrice) / 100) * 100;
    const color = random(COLORES);

    try {
      await db.insert(schema.products).values({
        id: productId,
        categoryId: item.categoryId,
        name: item.name,
        slug,
        description: `Prenda de calidad. Color ${color}. Diseño actual.`,
        price: String(price),
        color,
        isActive: true,
      });
    } catch (err: unknown) {
      const isDuplicate = err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "23505";
      if (isDuplicate) {
        existingSlugs.add(slug);
        continue;
      }
      throw err;
    }

    await db.insert(schema.productImages).values({
      id: generateId(),
      productId,
      url: `${IMG_BASE}${productId}/600/800`,
      alt: item.name,
      sortOrder: 0,
    });

    const sizesToUse = item.sizes[0] === "Único" ? ["Único"] : item.sizes;
    for (const size of sizesToUse) {
      await db.insert(schema.productSizes).values({
        id: generateId(),
        productId,
        size,
        stock: randomInt(5, 40),
      });
    }
    inserted++;
  }

  console.log(`Listo. Se insertaron ${inserted} productos (${items.length - inserted} ya existían y se omitieron).`);
}

seedProducts().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
