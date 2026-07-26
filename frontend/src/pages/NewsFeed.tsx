import { useState } from "react";
import { Newspaper, Send, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLocale } from "../hooks/useLocale";

interface NewsPost {
  id: string;
  title: string;
  body: string;
  media: string[];
  author: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const STORAGE_KEY = "cockroachhub-news";

function loadPosts(): NewsPost[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function savePosts(posts: NewsPost[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }

export default function NewsFeed() {
  const { t } = useLocale();
  const [posts, setPosts] = useState<NewsPost[]>(loadPosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const submit = () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setTimeout(() => {
      const post: NewsPost = {
        id: crypto.randomUUID?.() || Date.now().toString(36),
        title: title.trim(),
        body: body.trim(),
        media: mediaPreview,
        author: "Anonymous",
        status: "pending",
        created_at: new Date().toISOString(),
      };
      const updated = [post, ...posts];
      savePosts(updated);
      setPosts(updated);
      setTitle(""); setBody(""); setMediaPreview([]); setShowForm(false);
      setSending(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 100);
  };

  const approved = posts.filter((p) => p.status === "approved");

  return (
    <div className="min-h-screen bg-ph-light dark:bg-ph-black">
      <SEO title={`${t("news.title")} — CockroachHub`} desc={t("news.seoDesc")} />
      <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-ph-text-dark dark:text-white flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-ph-orange" />{t("news.title")}
            </h1>
            <p className="text-sm text-ph-text-muted mt-1">{t("news.subtitle")}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="ph-btn-primary ph-btn-sm flex items-center gap-1.5">
            <Send className="h-4 w-4" />{t("news.share")}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-4 mb-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={t("news.titlePlaceholder")} className="ph-input mb-3" />
            <textarea value={body} onChange={(e) => setBody(e.target.value)}
              placeholder={t("news.bodyPlaceholder")} className="ph-input mb-3 min-h-[100px]" />
            <div className="flex flex-wrap gap-2 mb-3">
              {mediaPreview.map((m, i) => (
                <div key={i} className="relative w-20 h-20">
                  {m.startsWith("data:video") ? (
                    <video src={m} className="w-full h-full object-cover rounded" />
                  ) : (
                    <img src={m} className="w-full h-full object-cover rounded" alt="" />
                  )}
                  <button onClick={() => setMediaPreview((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="ph-btn-outline ph-btn-sm flex items-center gap-1 cursor-pointer">
                <ImageIcon className="h-4 w-4" />{t("news.addMedia")}
                <input type="file" accept="image/*,video/*" multiple onChange={handleMedia} className="hidden" />
              </label>
              <button onClick={submit} disabled={sending || !title.trim() || !body.trim()}
                className="ph-btn-primary ph-btn-sm disabled:opacity-40">
                {sending ? "Posting..." : submitted ? "Posted!" : t("news.post")}
              </button>
            </div>
          </div>
        )}

        {approved.length === 0 ? (
          <div className="text-center py-12 text-ph-text-muted">
            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t("news.noPosts")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approved.map((post) => (
              <div key={post.id} className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-4">
                <h3 className="font-bold text-ph-text-dark dark:text-white mb-1">{post.title}</h3>
                <p className="text-sm text-ph-text-secondary mb-2">{post.body}</p>
                {post.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.media.map((m, i) => (
                      m.startsWith("data:video") ? (
                        <video key={i} src={m} controls className="max-h-48 rounded" />
                      ) : (
                        <img key={i} src={m} className="max-h-48 rounded object-cover" alt="" />
                      )
                    ))}
                  </div>
                )}
                <p className="text-xs text-ph-text-muted">{new Date(post.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-ph-orange/10 border border-ph-orange/20">
          <p className="text-xs text-ph-text-muted flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-ph-orange shrink-0" />
            Posts are reviewed before appearing publicly.
          </p>
        </div>
      </div>
    </div>
  );
}
