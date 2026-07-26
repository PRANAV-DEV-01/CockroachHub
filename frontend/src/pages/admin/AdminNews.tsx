import { useState, useEffect } from 'react'
import { Check, Trash2, X, Newspaper } from 'lucide-react'
import { useLocale } from '../../hooks/useLocale'
import toast from 'react-hot-toast'

interface NewsPost {
  id: string
  title: string
  body: string
  media: string[]
  author: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminNews() {
  const { t } = useLocale()
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  function loadPosts() {
    try {
      const raw = localStorage.getItem('cockroachhub-news')
      if (raw) {
        setPosts(JSON.parse(raw))
      }
    } catch {
      setPosts([])
    }
  }

  function savePosts(updated: NewsPost[]) {
    localStorage.setItem('cockroachhub-news', JSON.stringify(updated))
    setPosts(updated)
  }

  function approvePost(id: string) {
    const updated = posts.map(p =>
      p.id === id ? { ...p, status: 'approved' as const } : p
    )
    savePosts(updated)
    toast.success('Post approved')
  }

  function rejectPost(id: string) {
    const updated = posts.map(p =>
      p.id === id ? { ...p, status: 'rejected' as const } : p
    )
    savePosts(updated)
    toast.success('Post rejected')
  }

  function deletePost(id: string) {
    const updated = posts.filter(p => p.id !== id)
    savePosts(updated)
    toast.success('Post deleted')
  }

  const pendingPosts = posts.filter(p => p.status === 'pending')
  const approvedPosts = posts.filter(p => p.status === 'approved')
  const rejectedPosts = posts.filter(p => p.status === 'rejected')

  function renderPostCard(post: NewsPost) {
    const isExpanded = expandedId === post.id
    return (
      <div key={post.id} className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border rounded-lg p-4">
        <div className="cursor-pointer flex items-center justify-between" onClick={() => setExpandedId(isExpanded ? null : post.id)}>
          <div className="flex items-center gap-3">
            <Newspaper size={20} className="text-ph-text-muted" />
            <div>
              <h3 className="text-ph-text-dark dark:text-white font-medium">{post.title}</h3>
              <p className="text-ph-text-muted text-sm">{post.author} · {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.status === 'pending' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); approvePost(post.id); }} className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200" title="Approve"><Check size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); rejectPost(post.id); }} className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200" title="Reject"><X size={16} /></button>
              </>
            )}
            <button onClick={(e) => { e.stopPropagation(); deletePost(post.id); }} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-ph-text-muted hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-ph-border-light dark:border-ph-border">
            <p className="text-ph-text-dark dark:text-white whitespace-pre-wrap">{post.body}</p>
            {post.media && post.media.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.media.map((url, i) => (
                  <img key={i} src={url} alt="Media" className="w-24 h-24 object-cover rounded-md border border-ph-border" />
                ))}
              </div>
            )}
            <span className="mt-2 inline-block text-sm font-medium text-ph-text-muted">{post.status}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ph-text-dark dark:text-white flex items-center gap-2"><Newspaper className="h-5 w-5 text-ph-orange" />News Submissions</h1>
        <span className="bg-ph-orange/20 text-ph-orange px-3 py-1 rounded-full text-sm font-medium">{pendingPosts.length} pending</span>
      </div>
      {pendingPosts.length > 0 && <section><h2 className="text-lg font-semibold text-ph-text-dark dark:text-white mb-3">Pending Review</h2><div className="space-y-3">{pendingPosts.map(renderPostCard)}</div></section>}
      {approvedPosts.length > 0 && <section><h2 className="text-lg font-semibold text-ph-text-dark dark:text-white mb-3">Approved</h2><div className="space-y-3">{approvedPosts.map(renderPostCard)}</div></section>}
      {rejectedPosts.length > 0 && <section><h2 className="text-lg font-semibold text-ph-text-dark dark:text-white mb-3">Rejected</h2><div className="space-y-3">{rejectedPosts.map(renderPostCard)}</div></section>}
      {posts.length === 0 && <div className="bg-white dark:bg-ph-dark-2 border border-ph-border rounded-lg p-8 text-center"><Newspaper size={48} className="mx-auto text-ph-text-muted mb-3" /><p className="text-ph-text-muted">No news posts yet</p></div>}
    </div>
  )
}
