require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Anthropic Proxy Endpoint ─────────────────────────────────
app.post('/api/ai', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set. Please add it to your .env file or environment variables.'
    });
  }

  try {
    const { messages, model = 'claude-sonnet-4-20250514', max_tokens = 600, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

    const payload = { model, max_tokens, messages };
    if (system) payload.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// ─── Catch-all: serve index.html for SPA routing ─────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AI Personalized Learning server running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`\n   Make sure ANTHROPIC_API_KEY is set in your .env file.\n`);
});
