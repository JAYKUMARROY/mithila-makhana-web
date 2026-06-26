CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  weight_grams INTEGER DEFAULT 300,
  sku VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

INSERT INTO product_variants (product_id, size, price, stock, weight_grams)
SELECT 
  p.id,
  (s->>'size')::VARCHAR,
  (s->>'price')::DECIMAL,
  COALESCE((s->>'stock')::INTEGER, 0),
  CASE 
    WHEN s->>'size' = '50g' THEN 100
    WHEN s->>'size' = '100g' THEN 150
    WHEN s->>'size' IN ('200g', '250g') THEN 300
    WHEN s->>'size' = '500g' THEN 600
    ELSE 300
  END
FROM products p,
LATERAL jsonb_array_elements(
  CASE 
    WHEN p.description IS NOT NULL AND p.description::jsonb ? 'sizes' THEN (p.description::jsonb)->'sizes'
    ELSE '[]'::jsonb
  END
) AS s;

ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;

UPDATE products SET short_description = 
  COALESCE(
    CASE WHEN description IS NOT NULL AND description::jsonb ? 'category' THEN description::jsonb->>'category' ELSE NULL END,
    'Premium quality Mithila Makhana'
  )
WHERE description IS NOT NULL;
