/**
 * Envío de emails (Resend). Si RESEND_API_KEY no está configurado, no se envía.
 */
type SendOrderShippedParams = {
  to: string;
  customerName: string;
  orderId: string;
};

export async function sendOrderShippedEmail(params: SendOrderShippedParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Falcon Prime <onboarding@resend.dev>";

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("RESEND_API_KEY no está configurado. Agregalo en Vercel o .env.local.");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const subject = "Tu pedido fue despachado – Falcon Prime";
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido despachado</title>
</head>
<body style="margin:0; padding:0; font-family: system-ui, -apple-system, sans-serif; background:#f5f5f5;">
  <div style="max-width:560px; margin:0 auto; padding:24px; background:#fff; border-radius:8px; margin-top:24px;">
    <h1 style="font-size:20px; font-weight:600; color:#1a1a1a; margin:0 0 16px;">Falcon Prime</h1>
    <p style="font-size:16px; color:#1a1a1a; margin:0 0 8px;">Hola ${escapeHtml(params.customerName)},</p>
    <p style="font-size:16px; color:#1a1a1a; margin:0 0 16px;">
      Tu pedido <strong>#${escapeHtml(params.orderId.slice(0, 8))}</strong> fue despachado y está en camino.
    </p>
    <p style="font-size:14px; color:#6b6b6b; margin:0 0 24px;">
      Si te proporcionamos número de seguimiento, te lo enviaremos por este mismo medio.
    </p>
    <p style="font-size:14px; color:#6b6b6b; margin:0;">
      Gracias por tu compra.<br>
      <strong>Falcon Prime</strong>
    </p>
  </div>
</body>
</html>
`.trim();

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message ?? "Error al enviar el email");
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
