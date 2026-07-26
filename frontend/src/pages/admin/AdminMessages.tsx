import { useState, useEffect } from 'react'
import { MessageSquare, Eye } from 'lucide-react'
import { useLocale } from '../../hooks/useLocale'

interface Message {
  id: string
  title: string
  body: string
  status: 'sent' | 'read'
  created_at: string
}

export default function AdminMessages() {
  const { t } = useLocale()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  function loadMessages() {
    try {
      const raw = localStorage.getItem('cockroachhub-messages')
      if (raw) setMessages(JSON.parse(raw))
    } catch { setMessages([]) }
  }

  function saveMessages(updated: Message[]) {
    localStorage.setItem('cockroachhub-messages', JSON.stringify(updated))
    setMessages(updated)
  }

  function viewMessage(id: string) {
    setSelectedId(id)
    const updated = messages.map(m => m.id === id ? { ...m, status: 'read' as const } : m)
    saveMessages(updated)
  }

  const sorted = [...messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const unreadCount = messages.filter(m => m.status === 'sent').length
  const selectedMessage = messages.find(m => m.id === selectedId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ph-text-dark dark:text-white flex items-center gap-2"><MessageSquare className="h-5 w-5 text-ph-orange" />Messages</h1>
        <span className="bg-ph-orange/20 text-ph-orange px-3 py-1 rounded-full text-sm font-medium">{messages.length} total · {unreadCount} unread</span>
      </div>
      {selectedMessage ? (
        <div>
          <button onClick={() => setSelectedId(null)} className="text-ph-orange hover:underline text-sm mb-4 inline-block">← Back to messages</button>
          <div className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-ph-text-dark dark:text-white mb-2">{selectedMessage.title}</h2>
            <p className="text-ph-text-muted text-sm mb-4">{new Date(selectedMessage.created_at).toLocaleString()}</p>
            <div className="border-t border-ph-border pt-4"><p className="text-ph-text-dark dark:text-white whitespace-pre-wrap">{selectedMessage.body}</p></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(msg => (
            <div key={msg.id} className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border rounded-lg p-4 cursor-pointer hover:border-ph-orange/50 transition-colors" onClick={() => viewMessage(msg.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className={msg.status === 'sent' ? 'text-ph-orange' : 'text-ph-text-muted'} />
                  <div>
                    <h3 className="text-ph-text-dark dark:text-white font-medium">{msg.title}</h3>
                    <p className="text-ph-text-muted text-sm">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {msg.status === 'sent' && <span className="w-2 h-2 rounded-full bg-ph-orange" />}
                  <Eye size={16} className="text-ph-text-muted" />
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="bg-white dark:bg-ph-dark-2 border border-ph-border rounded-lg p-8 text-center"><MessageSquare size={48} className="mx-auto text-ph-text-muted mb-3" /><p className="text-ph-text-muted">No messages yet</p></div>}
        </div>
      )}
    </div>
  )
}
