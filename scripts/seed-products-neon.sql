-- Falcon Prime - Insertar productos en Neon
-- Ejecutar en Neon Console después de tener las 7 categorías y las tablas creadas.
-- Este archivo inserta 70 productos (10 por categoría). Para los 360 productos: npm run seed-products

WITH data(cat_slug, name, slug, price, color, sizes) AS (
  VALUES
    ('ropa', 'Remera básica algodón Negro', 'remera-basica-algodon-negro', 12900, 'Negro', 'S,M,L,XL'),
    ('ropa', 'Camisa Oxford Blanco', 'camisa-oxford-blanco', 15900, 'Blanco', 'S,M,L,XL'),
    ('ropa', 'Jean slim fit Gris', 'jean-slim-fit-gris', 18900, 'Gris', 'S,M,L,XL'),
    ('ropa', 'Pantalón chino Azul marino', 'pantalon-chino-azul-marino', 14900, 'Azul marino', 'S,M,L,XL'),
    ('ropa', 'Sweater de lana Beige', 'sweater-de-lana-beige', 22900, 'Beige', 'S,M,L,XL'),
    ('ropa', 'Blazer clásico Navy', 'blazer-clasico-navy', 29900, 'Navy', 'S,M,L,XL'),
    ('ropa', 'Short de vestir Crudo', 'short-de-vestir-crudo', 9900, 'Crudo', 'S,M,L,XL'),
    ('ropa', 'Pollera midi Rojo', 'pollera-midi-rojo', 11900, 'Rojo', 'S,M,L,XL'),
    ('ropa', 'Vestido casual Verde', 'vestido-casual-verde', 17900, 'Verde', 'S,M,L,XL'),
    ('ropa', 'Campera bomber Negro', 'campera-bomber-negro', 25900, 'Negro', 'S,M,L,XL'),
    ('calzado', 'Zapatilla urbana Blanco', 'zapatilla-urbana-blanco', 18900, 'Blanco', '38,39,40,41,42,43'),
    ('calzado', 'Zapato mocasín Camel', 'zapato-mocasin-camel', 22900, 'Camel', '38,39,40,41,42,43'),
    ('calzado', 'Bota chelsea Negro', 'bota-chelsea-negro', 27900, 'Negro', '38,39,40,41,42,43'),
    ('calzado', 'Sandalias cuero Marrón', 'sandalias-cuero-marron', 14900, 'Camel', '38,39,40,41,42,43'),
    ('calzado', 'Zapatilla running Gris', 'zapatilla-running-gris', 24900, 'Gris', '38,39,40,41,42,43'),
    ('calzado', 'Alpargata clásica Crudo', 'alpargata-clasica-crudo', 8900, 'Crudo', '38,39,40,41,42,43'),
    ('calzado', 'Zapato Oxford Navy', 'zapato-oxford-navy', 26900, 'Navy', '38,39,40,41,42,43'),
    ('calzado', 'Bota militar Verde militar', 'bota-militar-verde-militar', 29900, 'Verde militar', '38,39,40,41,42,43'),
    ('calzado', 'Mocasín driver Terracota', 'mocasin-driver-terracota', 19900, 'Terracota', '38,39,40,41,42,43'),
    ('calzado', 'Zapatilla slip-on Azul', 'zapatilla-slip-on-azul', 16900, 'Azul', '38,39,40,41,42,43'),
    ('accesorios', 'Cinturón cuero Negro', 'cinturon-cuero-negro', 4900, 'Negro', 'Único'),
    ('accesorios', 'Cartera crossbody Blanco', 'cartera-crossbody-blanco', 12900, 'Blanco', 'Único'),
    ('accesorios', 'Riñonera Gris', 'rinonera-gris', 7900, 'Gris', 'Único'),
    ('accesorios', 'Gorra baseball Navy', 'gorra-baseball-navy', 3900, 'Navy', 'Único'),
    ('accesorios', 'Bufanda lana Camel', 'bufanda-lana-camel', 5900, 'Camel', 'Único'),
    ('accesorios', 'Lentes de sol Negro', 'lentes-de-sol-negro', 9900, 'Negro', 'Único'),
    ('accesorios', 'Reloj minimal Plata', 'reloj-minimal-plata', 15900, 'Gris', 'Único'),
    ('accesorios', 'Bolso tote Beige', 'bolso-tote-beige', 13900, 'Beige', 'Único'),
    ('accesorios', 'Cinturón tela Crudo', 'cinturon-tela-crudo', 2900, 'Crudo', 'Único'),
    ('accesorios', 'Mochila urbana Bordó', 'mochila-urbana-bordo', 11900, 'Bordó', 'Único'),
    ('hombre', 'Camisa formal hombre Blanco', 'camisa-formal-hombre-blanco', 16900, 'Blanco', 'S,M,L,XL'),
    ('hombre', 'Pantalón de vestir Negro', 'pantalon-de-vestir-negro', 18900, 'Negro', 'S,M,L,XL'),
    ('hombre', 'Remera básica hombre Gris', 'remera-basica-hombre-gris', 6900, 'Gris', 'S,M,L,XL'),
    ('hombre', 'Saco sport Navy', 'saco-sport-navy', 27900, 'Navy', 'S,M,L,XL'),
    ('hombre', 'Jean clásico hombre Azul', 'jean-clasico-hombre-azul', 15900, 'Azul', 'S,M,L,XL'),
    ('hombre', 'Chomba hombre Rojo', 'chomba-hombre-rojo', 9900, 'Rojo', 'S,M,L,XL'),
    ('hombre', 'Pantalón gabardina Camel', 'pantalon-gabardina-camel', 17900, 'Camel', 'S,M,L,XL'),
    ('hombre', 'Campera de cuero Negro', 'campera-de-cuero-negro', 35900, 'Negro', 'S,M,L,XL'),
    ('hombre', 'Sweater cuello V Beige', 'sweater-cuello-v-beige', 19900, 'Beige', 'S,M,L,XL'),
    ('hombre', 'Short bermuda Crudo', 'short-bermuda-crudo', 8900, 'Crudo', 'S,M,L,XL'),
    ('mujer', 'Blusa manga corta Blanco', 'blusa-manga-corta-blanco', 9900, 'Blanco', 'S,M,L,XL'),
    ('mujer', 'Vestido midi mujer Negro', 'vestido-midi-mujer-negro', 19900, 'Negro', 'S,M,L,XL'),
    ('mujer', 'Pollera tableada Gris', 'pollera-tableada-gris', 11900, 'Gris', 'S,M,L,XL'),
    ('mujer', 'Remera mujer Rosa', 'remera-mujer-rosa', 6900, 'Rosa', 'S,M,L,XL'),
    ('mujer', 'Pantalón palazzo mujer Navy', 'pantalon-palazzo-mujer-navy', 15900, 'Navy', 'S,M,L,XL'),
    ('mujer', 'Top escote V Rojo', 'top-escote-v-rojo', 7900, 'Rojo', 'S,M,L,XL'),
    ('mujer', 'Vestido largo Verde', 'vestido-largo-verde', 22900, 'Verde', 'S,M,L,XL'),
    ('mujer', 'Jean high waist mujer Azul', 'jean-high-waist-mujer-azul', 14900, 'Azul', 'S,M,L,XL'),
    ('mujer', 'Blusa seda mujer Terracota', 'blusa-seda-mujer-terracota', 13900, 'Terracota', 'S,M,L,XL'),
    ('mujer', 'Short high waist Crudo', 'short-high-waist-crudo', 8900, 'Crudo', 'S,M,L,XL'),
    ('ninos', 'Remera infantil Azul', 'remera-infantil-azul', 3900, 'Azul', '2,4,6,8,10,12'),
    ('ninos', 'Pantalón niño Gris', 'pantalon-nino-gris', 4900, 'Gris', '2,4,6,8,10,12'),
    ('ninos', 'Vestido niña Rosa', 'vestido-nina-rosa', 6900, 'Rosa', '2,4,6,8,10,12'),
    ('ninos', 'Buzo niño Negro', 'buzo-nino-negro', 7900, 'Negro', '2,4,6,8,10,12'),
    ('ninos', 'Short infantil Blanco', 'short-infantil-blanco', 3500, 'Blanco', '2,4,6,8,10,12'),
    ('ninos', 'Pollera niña Rojo', 'pollera-nina-rojo', 4500, 'Rojo', '2,4,6,8,10,12'),
    ('ninos', 'Camisa niño Verde', 'camisa-nino-verde', 5900, 'Verde', '2,4,6,8,10,12'),
    ('ninos', 'Jean infantil Navy', 'jean-infantil-navy', 6900, 'Navy', '2,4,6,8,10,12'),
    ('ninos', 'Vestido niña casual Beige', 'vestido-nina-casual-beige', 7900, 'Beige', '2,4,6,8,10,12'),
    ('ninos', 'Campera niño Bordó', 'campera-nino-bordo', 12900, 'Bordó', '2,4,6,8,10,12'),
    ('deportes', 'Remera running Negro', 'remera-running-negro', 7900, 'Negro', 'S,M,L,XL'),
    ('deportes', 'Short deportivo Azul', 'short-deportivo-azul', 5900, 'Azul', 'S,M,L,XL'),
    ('deportes', 'Calza deportiva Gris', 'calza-deportiva-gris', 9900, 'Gris', 'S,M,L,XL'),
    ('deportes', 'Buzo deportivo Blanco', 'buzo-deportivo-blanco', 14900, 'Blanco', 'S,M,L,XL'),
    ('deportes', 'Top deportivo Rojo', 'top-deportivo-rojo', 6900, 'Rojo', 'S,M,L,XL'),
    ('deportes', 'Pantalón jogger deportivo Verde militar', 'pantalon-jogger-deportivo-verde-militar', 11900, 'Verde militar', 'S,M,L,XL'),
    ('deportes', 'Remera dry fit Navy', 'remera-dry-fit-navy', 8900, 'Navy', 'S,M,L,XL'),
    ('deportes', 'Short running Crudo', 'short-running-crudo', 4900, 'Crudo', 'S,M,L,XL'),
    ('deportes', 'Calza larga Negro', 'calza-larga-negro', 12900, 'Negro', 'S,M,L,XL'),
    ('deportes', 'Campera deportiva Camel', 'campera-deportiva-camel', 19900, 'Camel', 'S,M,L,XL')
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
