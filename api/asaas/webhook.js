import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.URL_SUPABASE,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const payload = req.body;

    console.log("Webhook Asaas recebido:", payload);

    const event = payload.event;
    const payment = payload.payment;

    if (!event || !payment) {
      return res.status(200).json({ received: true });
    }

    // 🔹 CLIENTE
    if (payment.customer) {
      await supabase
        .from("clientes_asaas")
        .upsert({
          asaas_customer_id: payment.customer,
          nome: payment.customerName || null,
          email: payment.customerEmail || null
        });
    }

    // 🔹 PAGAMENTOS
    if (event === "PAYMENT_CREATED" || event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const { error } = await supabase
        .from("asaas_pagamentos")
        .upsert({
          asaas_payment_id: payment.id,
          asaas_customer_id: payment.customer,
          status: payment.status,
          valor: payment.value,
          data_registro: payment.dateCreated,
          data_pagamento: payment.paymentDate || null
        });

      if (error) {
        console.error("Erro ao salvar pagamento:", error);
      } else {
        console.log("Pagamento salvo no Supabase:", payment.id);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(200).json({ error: "Erro tratado" });
  }
}
