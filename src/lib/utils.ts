/**
 * Utilidades compartidas - Falcon Prime
 */

/**
 * Genera un slug a partir de un texto (para URLs y búsquedas).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Formatea un precio para mostrar (ej: 2999.99 -> "2.999,99" o "$2.999,99").
 */
export function formatPrice(amount: number | string, options?: { currency?: string; locale?: string }): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const locale = options?.locale ?? "es-AR";
  return new Intl.NumberFormat(locale, {
    style: options?.currency ? "currency" : "decimal",
    currency: options?.currency ?? "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Genera un ID único (UUID simple para uso interno).
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
