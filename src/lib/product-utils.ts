export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  stock: number;
  weight_grams: number;
  sku?: string;
}

export interface ProductWithVariants {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  short_description: string | null;
  description: string | null;
  variants: ProductVariant[];
  is_active?: boolean;
}

export function parseProductMeta(description: string | null) {
  try {
    return JSON.parse(description || '{}');
  } catch (e) {
    return {};
  }
}

export function getLowestPrice(variants?: ProductVariant[]): number {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map(v => Number(v.price) || 0));
}

export function getSearchableText(product: ProductWithVariants): string {
  const meta = parseProductMeta(product.description);
  return `${product.name} ${product.short_description || ''} ${meta.category || ''}`.toLowerCase();
}

export function getVariantBySize(variants?: ProductVariant[], size?: string): ProductVariant | undefined {
  if (!variants || !size) return undefined;
  return variants.find(v => v.size === size);
}
