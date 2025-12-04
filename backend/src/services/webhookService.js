async function sendWebhook(url, payload) {
  try {
    const fetch = global.fetch || require('node-fetch');
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (err) {
    console.warn('Webhook send failed', err.message || err);
  }
}

module.exports = { sendWebhook };
