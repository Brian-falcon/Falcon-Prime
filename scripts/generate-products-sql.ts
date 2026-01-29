/**
 * Genera SQL para insertar todos los productos en Neon (sin usar DB).
 * Ejecutar: npx tsx scripts/generate-products-sql.ts
 * Escribe scripts/seed-products-neon.sql
 */
import * as fs from "fs";
import * as path from "path";
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function priceInRange(min: number, max: number): number {
  const p = randomInt(min, max);
  return Math.round(p / 100) * 100;
}

type ProductRow = { cat_slug: string; name: string; slug: string; price: number; color: string; sizes: string };
const allRows: ProductRow[] = [];
const usedSlugs = new Set<string>();

function addProducts(
  cat: string,
  names: string[],
  count: number,
  minP: number,
  maxP: number,
  sizesStr: string
) {
  for (let i = 0; i < count; i++) {
    const nameBase = names[i % names.length];
    const color = COLORES[i % COLORES.length];
    const name = `${nameBase} ${color}`;
    let slug = slugify(name);
    let n = 0;
    while (usedSlugs.has(slug)) {
      n++;
      slug = slugify(name) + "-" + n;
    }
    usedSlugs.add(slug);
    const price = priceInRange(minP, maxP);
    allRows.push({ cat_slug: cat, name, slug, price, color, sizes: sizesStr });
  }
}

addProducts("ropa", ROPA, 55, 4500, 35000, "S,M,L,XL");
addProducts("calzado", CALZADO, 50, 8000, 45000, "38,39,40,41,42,43");
addProducts("accesorios", ACCESORIOS, 45, 2000, 22000, "Único");
addProducts("hombre", HOMBRE, 55, 5000, 38000, "S,M,L,XL");
addProducts("mujer", MUJER, 55, 4500, 36000, "S,M,L,XL");
addProducts("ninos", NINOS, 45, 2500, 18000, "2,4,6,8,10,12");
addProducts("deportes", DEPORTES, 55, 4000, 28000, "S,M,L,XL");

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

const vals = allRows
  .map(
    (r) =>
      `    ('${esc(r.cat_slug)}', '${esc(r.name)}', '${esc(r.slug)}', ${r.price}, '${esc(r.color)}', '${r.sizes}')`
  )
  .join(",\n");

const sql = `-- Falcon Prime - Insertar ${allRows.length} productos en Neon
-- Ejecutar en Neon Console después de tener las 7 categorías y las tablas creadas.
-- No borra datos existentes; asegurate de no tener slugs duplicados.

WITH data(cat_slug, name, slug, price, color, sizes) AS (
  VALUES
${vals}
),
ins AS (
  INSERT INTO products (id, category_id, name, slug, description, price, color, is_active)
  SELECT gen_random_uuid(), c.id, d.name, d.slug, 'Prenda de calidad. Color ' || d.color || '.', d.price, d.color, true
  FROM data d JOIN categories c ON c.slug = d.cat_slug
  RETURNING id, slug
),
img AS (
  INSERT INTO product_images (id, product_id, url, alt, sort_order)
  SELECT gen_random_uuid(), i.id, 'https://picsum.photos/seed/' || i.id || '/600/800', i.slug, 0
  FROM ins i
)
INSERT INTO product_sizes (id, product_id, size, stock)
SELECT gen_random_uuid(), i.id, trim(s.size), 5 + floor(random()*36)::int
FROM ins i
JOIN data d ON d.slug = i.slug
CROSS JOIN LATERAL unnest(string_to_array(d.sizes, ',')) AS s(size);
`;

const outPath = path.join(__dirname, "seed-products-neon.sql");
fs.writeFileSync(outPath, sql, "utf8");
console.log("Generado:", outPath, "(" + allRows.length + " productos)");
