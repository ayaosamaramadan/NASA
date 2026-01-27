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

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {}
    if (!messages || !Array.isArray(messages)) {
       return res.status(400).json({ error: 'messages param required (array)' })
    }
       if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'server_not_configured' })
    }

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const url =
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`

    const upstream = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    })

    const json = await upstream.json()
    if (!upstream.ok) {
      console.error('Gemini error', json)
      return res.status(upstream.status).json(json)
    }

    const reply =
      json.candidates?.[0]?.content?.parts?.[0]?.text || ''

    res.json({ reply })
  } catch (err) {
    console.error('Chat proxy error', err)
    res.status(500).json({ error: 'server_error', message: err.message })
  }
})

app.get('/ping', (req, res) => res.json({ ok: true, env: !!GEMINI_KEY }))

app.listen(PORT, () => console.log(`Chat proxy listening on http://localhost:${PORT}`))
