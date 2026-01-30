/**
 * Estados de pedido y etiquetas para mostrar en admin y emails.
 */

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "shipped",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  preparing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
};

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status;
}
