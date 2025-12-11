const ApiKey = require('../models/ApiKey');

async function sendWebhook(url, payload) {
  try {
    const fetch = global.fetch || require('node-fetch');
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (err) {
    console.warn(`Webhook send failed to ${url}:`, err.message || err);
  }
}

async function broadcast(eventType, data) {
  try {
    // Find all integration partners with a webhook URL
    const partners = await ApiKey.find({
      revoked: false,
      webhookUrl: { $exists: true, $ne: '' }
    });

    if (partners.length === 0) return;

    const payload = {
      event: eventType,
      timestamp: new Date(),
      data
    };

    // Send to all in parallel
    const promises = partners.map(p => sendWebhook(p.webhookUrl, payload));
    await Promise.allSettled(promises);

    console.log(`Broadcasted ${eventType} to ${partners.length} partners`);
  } catch (err) {
    console.error('Broadcast error:', err);
  }
}

module.exports = { sendWebhook, broadcast };
