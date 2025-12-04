const { sendWebhook } = require('../services/webhookService');

exports.register = async (req, res) => {
  res.json({ ok: true });
};

exports.trigger = async (req, res) => {
  const { url, payload } = req.body;
  await sendWebhook(url, payload);
  res.json({ ok: true });
};
