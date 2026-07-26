import { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLocale } from "../hooks/useLocale";

interface AdminMessage {
  id: string;
  title: string;
  body: string;
  status: "sent" | "read";
  created_at: string;
}

const STORAGE_KEY = "cockroachhub-messages";

function loadMessages(): AdminMessage[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveMessages(msgs: AdminMessage[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); }

export default function ContactAdmin() {
  const { t } = useLocale();
  const [messages, setMessages] = useState<AdminMessage[]>(loadMessages);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setTimeout(() => {
      const msg: AdminMessage = {
        id: crypto.randomUUID?.() || Date.now().toString(36),
        title: title.trim(),
        body: body.trim(),
        status: "sent",
        created_at: new Date().toISOString(),
      };
      const updated = [msg, ...messages];
      saveMessages(updated);
      setMessages(updated);
      setTitle(""); setBody("");
      setSent(true);
      setSending(false);
      setTimeout(() => setSent(false), 3000);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ph-light dark:bg-ph-black">
      <SEO title={`${t("contact.title")} — CockroachHub`} desc={t("contact.seoDesc")} />
      <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-ph-text-dark dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-ph-orange" />{t("contact.title")}
          </h1>
          <p className="text-sm text-ph-text-muted mt-1">{t("contact.subtitle")}</p>
        </div>

        <div className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-4 mb-6">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t("contact.titlePlaceholder")} className="ph-input mb-3" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder={t("contact.bodyPlaceholder")} className="ph-input mb-3 min-h-[120px]" />
          <button onClick={submit} disabled={!title.trim() || !body.trim() || sending}
            className="ph-btn-primary ph-btn-sm flex items-center gap-1.5 disabled:opacity-40">
            <Send className="h-4 w-4" />{sending ? t("contact.sending") : sent ? t("contact.sent") : t("contact.sendMessage")}
          </button>
          {sent && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />{t("contact.success")}
            </p>
          )}
        </div>

        {messages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-ph-text-muted mb-3">{t("contact.yourMessages")}</h2>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm text-ph-text-dark dark:text-white">{msg.title}</h3>
                    <span className={`text-xs px-1.5 py-0.5 ${msg.status === "read" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}>
                      {msg.status === "read" ? t("contact.read") : t("contact.delivered")}
                    </span>
                  </div>
                  <p className="text-sm text-ph-text-secondary">{msg.body}</p>
                  <p className="text-xs text-ph-text-muted mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
