const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || "v26.0";

const getConfig = () => ({
  token: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  recipients: (process.env.WHATSAPP_RECIPIENTS || "")
    .split(",")
    .map((value) => value.trim().replace(/\D/g, ""))
    .filter(Boolean),
  templateName: process.env.WHATSAPP_TEMPLATE_NAME || "pds_daily_post",
  templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US",
});

const assertConfigured = () => {
  const config = getConfig();
  const missing = [];
  if (!config.token) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!config.phoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (!config.recipients.length) missing.push("WHATSAPP_RECIPIENTS");
  if (!config.templateName) missing.push("WHATSAPP_TEMPLATE_NAME");
  if (missing.length) throw new Error(`WhatsApp is not configured: ${missing.join(", ")}`);
  return config;
};

const graphRequest = async (phoneNumberId, token, body) => {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    const detail = data?.error?.message || JSON.stringify(data);
    throw new Error(`WhatsApp API error: ${detail}`);
  }
  return data;
};

const sendDailyPostTemplate = async ({ recipient, imageUrl, date, occasion }) => {
  const config = assertConfigured();

  // The approved WhatsApp template should have an IMAGE header and one BODY text
  // variable. Keep the body short so the template remains reusable.
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "template",
    template: {
      name: config.templateName,
      language: { code: config.templateLanguage },
      components: [
        {
          type: "header",
          parameters: [{ type: "image", image: { link: imageUrl } }],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: date },
            { type: "text", text: occasion || "आज का विशेष संगीत पोस्ट" },
          ],
        },
      ],
    },
  };

  return graphRequest(config.phoneNumberId, config.token, body);
};

const sendDailyPostToAll = async ({ imageUrl, date, occasion }) => {
  const config = assertConfigured();
  const results = [];

  for (const recipient of config.recipients) {
    const response = await sendDailyPostTemplate({ recipient, imageUrl, date, occasion });
    results.push({
      recipient,
      messageId: response?.messages?.[0]?.id || null,
      response,
    });
  }

  return results;
};

export { sendDailyPostToAll };
