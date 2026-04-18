const https = require('https');
const { Client } = require('pg');

const POLL_INTERVAL = 2000; // 2 seconds
let lastUpdateId = 0;

async function getSettings() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://korobkov:korobkov@pg:5432/korobkov',
  });
  await client.connect();
  const res = await client.query('SELECT * FROM "SiteSettings" WHERE id = $1', ['default']);
  await client.end();
  return res.rows[0] || null;
}

async function getStats() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://korobkov:korobkov@pg:5432/korobkov',
  });
  await client.connect();
  const artworks = await client.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'available\') as available, COUNT(*) FILTER (WHERE status = \'sold\') as sold FROM "Artwork"');
  const orders = await client.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'INQUIRY\') as pending FROM "Order"');
  await client.end();
  return { artworks: artworks.rows[0], orders: orders.rows[0] };
}

async function getRecentOrders() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://korobkov:korobkov@pg:5432/korobkov',
  });
  await client.connect();
  const res = await client.query(`
    SELECT o.id, o.status, o."carrierName", o."createdAt", a.title as artwork_title, u.name as buyer_name, u.email as buyer_email
    FROM "Order" o
    LEFT JOIN "Artwork" a ON o."artworkId" = a.id
    LEFT JOIN "User" u ON o."userId" = u.id
    ORDER BY o."createdAt" DESC LIMIT 5
  `);
  await client.end();
  return res.rows;
}

function sendMessage(token, chatId, text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getUpdates(token, offset) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${token}/getUpdates?offset=${offset}&timeout=1`,
      method: 'GET',
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve({ ok: false, result: [] }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function isAllowed(userId, username, allowedList) {
  if (!allowedList || allowedList.trim() === '') return true; // empty = allow all
  const allowed = allowedList.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(String(userId)) || allowed.includes((username || '').toLowerCase());
}

async function handleCommand(token, chatId, command, settings) {
  switch (command) {
    case '/status': {
      const stats = await getStats();
      await sendMessage(token, chatId,
        `<b>Korobkov Art Studio</b>\n\n` +
        `Artworks: ${stats.artworks.total} (${stats.artworks.available} available, ${stats.artworks.sold} sold)\n` +
        `Orders: ${stats.orders.total} (${stats.orders.pending} pending)`
      );
      break;
    }
    case '/orders': {
      const orders = await getRecentOrders();
      if (orders.length === 0) {
        await sendMessage(token, chatId, 'No orders yet.');
      } else {
        const text = orders.map(o =>
          `#${o.id.slice(-6)} | ${o.status} | ${o.artwork_title || 'N/A'} | ${o.buyer_name || o.buyer_email || 'Guest'} | ${new Date(o.createdAt).toLocaleDateString()}`
        ).join('\n');
        await sendMessage(token, chatId, `<b>Recent Orders</b>\n\n<pre>${text}</pre>`);
      }
      break;
    }
    case '/artworks': {
      const stats = await getStats();
      await sendMessage(token, chatId,
        `<b>Artworks</b>\n\n` +
        `Total: ${stats.artworks.total}\n` +
        `Available: ${stats.artworks.available}\n` +
        `Sold: ${stats.artworks.sold}`
      );
      break;
    }
    case '/help':
    default:
      await sendMessage(token, chatId,
        `<b>Korobkov Art Bot</b>\n\n` +
        `/status - Site & artwork stats\n` +
        `/orders - Recent orders\n` +
        `/artworks - Artwork counts\n` +
        `/help - This message`
      );
  }
}

async function poll() {
  try {
    const settings = await getSettings();
    if (!settings || !settings.tgEnabled || !settings.tgBotToken) {
      // Bot not configured, retry later
      setTimeout(poll, 10000);
      return;
    }

    const token = settings.tgBotToken;
    const updates = await getUpdates(token, lastUpdateId + 1);

    if (updates.ok && updates.result) {
      for (const update of updates.result) {
        lastUpdateId = update.update_id;
        const msg = update.message;
        if (!msg || !msg.text) continue;

        // Check whitelist
        if (!isAllowed(msg.from.id, msg.from.username, settings.tgAllowedUsers)) continue;

        const command = msg.text.split(' ')[0].split('@')[0].toLowerCase();
        await handleCommand(token, msg.chat.id, command, settings);
      }
    }
  } catch (err) {
    console.error('[Bot] Error:', err.message);
  }

  setTimeout(poll, POLL_INTERVAL);
}

console.log('[Bot] Korobkov Art Bot starting...');
poll();
