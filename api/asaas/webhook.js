import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    console.log('Webhook Asaas recebido:', payload);

    const eventType = payload.event;
    const payment = payload.payment;

    if (!payment) {
      return res.status(200).json({ received: true });
    }

    const asaasCustomerId = payment.customer;
    const asaasPaymentId = payment.id;
    const status = payment.status;
    const value = payment.value || 0;
    const dueDate = payment.dueDate || null;
    const paymentDate = payment.paymentDate || null;

    // 🔹 Salva cliente (se ainda não existir)
    await supabase
      .from('asaas_clientes')
      .upsert({
        asaas_customer_id: asaasCustomerId
      }, { onConflict: ['asaas_customer_id'] });

    // 🔹 Salva / atualiza pagamento
    await supabase
      .from('asaas_pagamentos')
      .upsert({
        asaas_payment_id: asaasPaymentId,
        asaas_customer_id: asaasCustomerId,
        status,
        valor: value,
        data_registro: dueDate,
        data_pagamento: paymentDate
      }, { onConflict: ['asaas_payment_id'] });

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Erro no webhook Asaas:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}


