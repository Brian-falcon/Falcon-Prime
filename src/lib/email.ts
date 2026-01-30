/**
 * Envío de emails (Resend). Plantilla profesional para notificaciones de pedido.
 * Los correos llegan al email del cliente (Gmail, Outlook, etc.) que usó en el checkout.
 */
type OrderEmailParams = {
  to: string;
  customerName: string;
  orderId: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("RESEND_API_KEY no está configurado. Agregalo en Vercel o .env.local.");
  }
  return { apiKey, from: process.env.EMAIL_FROM ?? "Falcon Prime <onboarding@resend.dev>" };
}

/**
 * Plantilla HTML profesional para emails al cliente.
 * Estructura: Falcon Prime → Hola [Nombre], → mensaje → Gracias por confiar en nosotros. → Falcon Prime
 */
function orderEmailTemplate(params: OrderEmailParams, bodyContent: string): string {
  const name = escapeHtml(params.customerName);
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Falcon Prime – Actualización de pedido</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background:#f5f5f5; color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06); overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid #eee;">
              <p style="margin:0; font-size:20px; font-weight:700; letter-spacing:0.04em; color:#1a1a1a;">Falcon Prime</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#1a1a1a;">Hola ${name},</p>
              ${bodyContent}
              <p style="margin:24px 0 0; font-size:15px; line-height:1.6; color:#1a1a1a;">Gracias por confiar en nosotros.</p>
              <p style="margin:8px 0 0; font-size:15px; font-weight:600; color:#1a1a1a;">Falcon Prime</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/** Email cuando el pedido pasa a "En preparación" */
export async function sendOrderPreparingEmail(params: OrderEmailParams): Promise<void> {
  const { apiKey, from } = getResendClient();
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const subject = "Tu pedido está en preparación | Falcon Prime";
  const shortId = escapeHtml(params.orderId.slice(0, 8));
  const body = `
    <p style="margin:0; font-size:16px; line-height:1.6; color:#1a1a1a;">
      Tu pedido #${shortId} está en preparación. Te avisaremos cuando sea despachado.
    </p>`;
  const html = orderEmailTemplate(params, body);
  const { error } = await resend.emails.send({ from, to: params.to, subject, html });
  if (error) throw new Error(error.message ?? "Error al enviar el email");
}

/** Email cuando el pedido pasa a "Enviado" (despachado) */
export async function sendOrderShippedEmail(params: OrderEmailParams): Promise<void> {
  const { apiKey, from } = getResendClient();
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const subject = "Tu pedido fue despachado | Falcon Prime";
  const shortId = escapeHtml(params.orderId.slice(0, 8));
  const body = `
    <p style="margin:0; font-size:16px; line-height:1.6; color:#1a1a1a;">
      Tu pedido #${shortId} fue despachado y está en camino.
    </p>`;
  const html = orderEmailTemplate(params, body);
  const { error } = await resend.emails.send({ from, to: params.to, subject, html });
  if (error) throw new Error(error.message ?? "Error al enviar el email");
}

/** Email cuando el pedido pasa a "Entregado" */
export async function sendOrderDeliveredEmail(params: OrderEmailParams): Promise<void> {
  const { apiKey, from } = getResendClient();
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const subject = "Tu pedido fue entregado | Falcon Prime";
  const shortId = escapeHtml(params.orderId.slice(0, 8));
  const body = `
    <p style="margin:0; font-size:16px; line-height:1.6; color:#1a1a1a;">
      Tu pedido #${shortId} fue entregado. Esperamos que disfrutes tu compra.
    </p>`;
  const html = orderEmailTemplate(params, body);
  const { error } = await resend.emails.send({ from, to: params.to, subject, html });
  if (error) throw new Error(error.message ?? "Error al enviar el email");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
