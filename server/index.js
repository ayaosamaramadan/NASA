require('dotenv').config()
const express = require('express')
let fetchFn
try {
  fetchFn = require('undici').fetch
} catch (e) {
  fetchFn = global.fetch
}
const cors = require('cors')

const app = express()
app.use(cors({ origin: '*'})) 
app.use(express.json({ limit: '100kb' }))

const PORT = process.env.PORT || 3001
const COPILOT_URL = process.env.COPILOT_API_URL
const COPILOT_KEY = process.env.COPILOT_API_KEY
const MODEL = process.env.COPILOT_MODEL || 'gpt-4o-mini'

if (!COPILOT_URL || !COPILOT_KEY) {
  console.warn('Warning: COPILOT_API_URL or COPILOT_API_KEY not set in server/.env')
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {}
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages param required (array)' })
    }
    if (!COPILOT_URL || !COPILOT_KEY) {
      return res.status(500).json({ error: 'server_not_configured' })
    }

    const payload = { model: MODEL, messages }

    const upstream = await fetchFn(COPILOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COPILOT_KEY}`
      },
      body: JSON.stringify(payload),
      // optional: signal/timeout not shown here
    })

    if (!upstream.ok) {
      const text = await upstream.text()
      console.error('Upstream error', upstream.status, text)
      return res.status(502).json({ error: 'upstream_error', status: upstream.status, detail: text })
    }

    const json = await upstream.json()
    // Determine assistant text safely
    let assistantReply = ''
    if (json.choices && json.choices[0] && json.choices[0].message) {
      assistantReply = json.choices[0].message.content || ''
    } else if (json.output || json.result) {
      assistantReply = json.output || json.result
    } else {
      assistantReply = typeof json === 'string' ? json : JSON.stringify(json)
    }

    res.json({ reply: assistantReply })
  } catch (err) {
    console.error('Chat proxy error', err)
    res.status(500).json({ error: 'server_error', message: err.message })
  }
})

app.get('/ping', (req, res) => res.json({ ok: true, env: !!COPILOT_KEY }))

app.listen(PORT, () => console.log(`Chat proxy listening on http://localhost:${PORT}`))
