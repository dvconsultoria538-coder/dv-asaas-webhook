import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  // ✅ RESPONDE IMEDIATAMENTE AO ASAAS
  res.status(200).json({ received: true });

  try {
    const payload = req.body;

    console.log("Webhook Asaas:", payload);

    const { event, payment } = payload;

    if (!event || !payment) return;

    // 👉 PROCESSAMENTO EM BACKGROUND
    switch (event) {
      case "PAYMENT_CREATED":
        console.log("Pagamento criado:", payment.id);
        break;

      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log("Pagamento confirmado:", payment.id);
        break;

      case "PAYMENT_OVERDUE":
        console.log("Pagamento vencido:", payment.id);
        break;

      default:
        console.log("Evento ignorado:", event);
    }

  } catch (err) {
    console.error("Erro interno webhook:", err);
  }
}
