import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  // ✅ RESPONDE IMEDIATAMENTE AO ASAAS
  res.status(200).json({ received: true });

  const payload = req.body;
  const { event, payment } = payload || {};

  if (!event || !payment) return;

  try {
    if (
      event === "PAYMENT_RECEIVED" ||
      event === "PAYMENT_CONFIRMED"
    ) {
      console.log("Pagamento confirmado:", payment.id);

      // 🔥 SEM await (isso é o segredo)
      supabase
        .from("asaas_pagamentos")
        .insert({
          asaas_payment_id: payment.id,
          asaas_customer_id: payment.customer,
          status: payment.status,
          valor: payment.value,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Erro Supabase:", error);
          }
        });
    }
  } catch (err) {
    console.error("Erro interno webhook:", err);
  }
}
