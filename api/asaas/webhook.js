import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { event, payment } = req.body || {};

  // responde rápido ao Asaas
  res.status(200).end();

  // só salva pagamentos confirmados
  if (!event || !payment) return;

  if (event !== "PAYMENT_CONFIRMED" && event !== "PAYMENT_RECEIVED") return;

  try {
    await supabase.from("asaas_pagamentos").insert({
      asaas_payment_id: payment.id,
      asaas_customer_id: payment.customer,
      status: payment.status,
      valor: payment.value,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro Supabase:", err);
  }
}

