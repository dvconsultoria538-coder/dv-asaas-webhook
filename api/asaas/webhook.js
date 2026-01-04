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

    switch (event) {
      case "PAYMENT_CREATED":
        console.log("Pagamento criado:", payment.id);
        break;

      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log("Pagamento confirmado:", payment.id);
        // 👉 aqui depois você grava no Supabase
        break;

      case "PAYMENT_OVERDUE":
        console.log("Pagamento vencido:", payment.id);
        break;

      default:
        console.log("Evento ignorado:", event);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(200).json({ error: "Erro tratado" });
  }
}


