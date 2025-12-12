import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const send = async () => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setText('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      const reply = data.reply ?? 'No response'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: failed to fetch' }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow-lg"
    >Open Chat</button>
  )

  return (
    <div  style={{
          backgroundImage: "url('/background_stars_grid.jpg')",
       
       
      
        }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="bg-gray-900 text-white w-full max-w-3xl h-full md:h-[80vh] rounded-lg shadow-xl flex flex-col overflow-hidden"
      
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="text-lg font-medium">Chatbot</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">assistant</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >Close</button>
          </div>
        </header>

        <div ref={scrollRef} className="messages flex-1 overflow-auto p-4 space-y-3 bg-gradient-to-b from-transparent to-gray-900/20">
          {messages.length === 0 && (
            <div className="text-center text-sm text-gray-400">Say hello — the assistant is ready.</div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] break-words p-3 rounded-lg leading-normal ${m.role === 'user' ? 'bg-cyan-900 text-cyan-100 rounded-br-sm' : 'bg-gray-800 text-gray-200 rounded-bl-sm'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-800 bg-gradient-to-t from-black/20 to-transparent">
          <div className="flex gap-2 items-end">
            <textarea
              className="flex-1 min-h-[44px] max-h-36 resize-none p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ask the bot..."
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />

            <button
              onClick={send}
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 rounded text-sm disabled:opacity-50"
            >{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
