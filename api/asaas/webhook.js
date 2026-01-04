export default async function handler(req, res) {
  // Só aceita POST (padrão do Asaas)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const event = req.body;

    // Log para debug (aparece nos logs da Vercel)
    console.log("Webhook Asaas recebido:", event);

    const { event: eventType, payment } = event;

    // Exemplo de eventos importantes
    switch (eventType) {
      case "PAYMENT_CONFIRMED":
        console.log("Pagamento confirmado:", payment.id);
        break;

      case "PAYMENT_RECEIVED":
        console.log("Pagamento recebido:", payment.id);
        break;

      case "PAYMENT_OVERDUE":
        console.log("Pagamento vencido:", payment.id);
        break;

      case "PAYMENT_CANCELED":
        console.log("Pagamento cancelado:", payment.id);
        break;

      default:
        console.log("Evento não tratado:", eventType);
    }

    // Sempre responda 200 para o Asaas
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erro no webhook Asaas:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}

