import { useState, useRef, useEffect } from 'react'
import CustomCursor from './hooks/CustomCursor';
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from 'react-router';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center border-b-cyan-900 border p-4">
      <video className="bg-video " autoPlay muted loop playsInline>
        <source src="/vid.mp4" type="video/mp4" />
      </video> <CustomCursor />

      <div
        style={{ backgroundImage: "url('/background_stars_grid.jpg')" }}
        className="border-cyan-900 text-white w-full max-w-3xl h-full md:h-[80vh] rounded-lg shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm border"
      >
        <svg style={{ display: 'none' }} aria-hidden>
          <symbol id="icon-robot" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2a2 2 0 0 0-2 2v1H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-3V4a2 2 0 0 0-2-2zM9 5a3 3 0 0 1 6 0v1H9V5zM8 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </symbol>
          <symbol id="icon-send" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </symbol>
          <symbol id="icon-user" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2-8 4v2h16v-2c0-2-3.6-4-8-4z" />
          </symbol>
          <symbol id="icon-close" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3 10.6 10.6 16.9 4.3z" />
          </symbol>
          <symbol id="icon-settings" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.4 0-.8-.1-1.2l2-1.6-2-3.5-2.4.6a7.7 7.7 0 0 0-1.9-1.1L14.8 1h-5.6L8.8 3.8c-.7.2-1.4.6-1.9 1.1L4.5 4.3 2.6 7.8l2 1.6c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.6 2 3.5 2.4-.6c.5.5 1.2.9 1.9 1.1L9.2 23h5.6l.6-2.8c.7-.2 1.4-.6 1.9-1.1l2.4.6 2-3.5-2-1.6c.1-.4.1-.8.1-1.2z" />
          </symbol>
        </svg>

        <header className="flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/40 to-transparent border-b border-cyan-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center ring-1 ring-cyan-900/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                <use href="#icon-robot" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Assistant</h3>
              <p className="text-xs text-gray-400">AI powered helper</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Settings"
              className="p-2 rounded hover:bg-white/5"
              title="Settings"
            >
              <svg className="w-5 h-5 text-gray-300"><use href="#icon-settings" /></svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-2 rounded hover:bg-white/5"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-300"><use href="#icon-close" /></svg>
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          className="messages flex-1 overflow-auto p-5 space-y-4 bg-gradient-to-b from-transparent to-black/40 border-t border-cyan-900/20"
          style={{ scrollbarGutter: 'stable' }}
        >
          {messages.length === 0 && (
            <div className="mx-auto max-w-xl text-center text-gray-400">
              <div className="mb-3">Say hello — the assistant is ready.</div>
              <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-sm">
                <svg className="w-4 h-4 text-cyan-300"><use href="#icon-robot" /></svg>
                Try: "Explain the Apollo guidance computer"
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-cyan-300 shrink-0 ring-1 ring-cyan-900/20">
                  <svg className="w-5 h-5">
                    <use href={m.role === 'user' ? '#icon-user' : '#icon-robot'} />
                  </svg>
                </div>
                <div className={`p-3 rounded-lg leading-relaxed shadow-md ${m.role === 'user' ? 'bg-cyan-700 text-white rounded-br-sm border border-cyan-900/20' : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-cyan-900/20'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-cyan-300 ring-1 ring-cyan-900/20">
                  <svg className="w-5 h-5"><use href="#icon-robot" /></svg>
                </div>
                <div className="p-3 rounded-lg bg-gray-800 text-gray-200 animate-pulse border border-cyan-900/20">
                  Typing...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-white/5 bg-gradient-to-t from-black/30 to-transparent">
          <div className="flex gap-3 items-end">
            <textarea
              className="flex-1 min-h-11 max-h-36 resize-none p-3 rounded-lg bg-[#0b1220] border border-cyan-900/30 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ask the assistant..."
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />

            <div className="flex items-center gap-2">
              <button
                aria-label="Attach"
                className="p-2 rounded-md hover:bg-white/5"
                title="Attach"
              >
                <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16.5 6.5l-7.07 7.07a3 3 0 1 0 4.24 4.24L22 9.5 20.5 8l-6.83 6.83a1 1 0 0 1-1.41-1.41L19.09 6.5z" />
                </svg>
              </button>

              <button
                onClick={send}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm disabled:opacity-60 border border-cyan-900/30"
                title="Send"
              >
                <svg className="w-4 h-4 text-white"><use href="#icon-send" /></svg>
                <span className="font-medium">{loading ? 'Sending' : 'Send'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>   <Link to="/">
        <div className="relative"></div>
        <button
          className="cursor-none absolute top-10 rotate-46 left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
          onMouseEnter={(e) => {
            const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
            if (tooltip) tooltip.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
            if (tooltip) tooltip.style.opacity = '0';
          }}
        >
          <IoArrowBackSharp className='rotate-[-46deg]' />
        </button>
      
      </Link>
    </div>
  )
}
