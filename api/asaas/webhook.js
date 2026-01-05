import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  // ✅ RESPONDE E ENCERRA IMEDIATAMENTE (ASAAS NÃO PENALIZA)
  res.status(200).json({ received: true });

  // ⛔ NADA DE TRY/CATCH ENVOLVENDO O RESPONSE
  const payload = req.body;
  if (!payload || !payload.event || !payload.payment) return;

  const { event, payment } = payload;

  // 🔥 PROCESSAMENTO TOTALMENTE DESACOPLADO
  if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
    queueMicrotask(() => {
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
          } else {
            console.log("Pagamento salvo:", payment.id);
          }
        })
        .catch((err) => {
          console.error("Falha Supabase:", err);
        });
    });
  }
}
