import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight, Lock, Pin, Clock, User, MessageSquare,
  Send, Loader2, Shield, Quote, Flag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username?: string;
  postCount?: number;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const Avatar = ({ name, size = 10 }: { name: string; size?: number }) => {
  const colors = [
    "hsla(43,65%,45%,0.25)", "hsla(200,85%,45%,0.25)",
    "hsla(120,60%,40%,0.25)", "hsla(280,60%,50%,0.25)",
    "hsla(0,60%,45%,0.25)",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const textColors = ["hsl(43,75%,62%)", "hsl(200,90%,68%)", "hsl(120,60%,60%)", "hsl(280,70%,70%)", "hsl(0,70%,65%)"];

  return (
    <div
      className={`w-${size} h-${size} rounded flex items-center justify-center font-cinzel font-black text-lg flex-shrink-0`}
      style={{ background: colors[idx], border: `1px solid ${textColors[idx].replace(")", ", 0.4)")}`, color: textColors[idx] }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
};

const ForumThread = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [thread, setThread] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const loadThread = async () => {
    setLoading(true);

    // Increment views
    await supabase.rpc("increment_thread_views" as any, { thread_id: id }).catch(() => {});

    const { data: t } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("id", id)
      .single();
    setThread(t);

    if (t) {
      const { data: cat } = await supabase
        .from("forum_categories")
        .select("*")
        .eq("id", t.category_id)
        .single();
      setCategory(cat);
    }

    // Load posts
    const { data: rawPosts } = await supabase
      .from("forum_posts")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });

    if (rawPosts) {
      const enriched = await Promise.all(
        rawPosts.map(async (p) => {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("username")
            .eq("id", p.user_id)
            .single();

          const { count } = await supabase
            .from("forum_posts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.user_id);

          return { ...p, username: profile?.username ?? "Unbekannt", postCount: count ?? 0 };
        })
      );
      setPosts(enriched);
    }
    setLoading(false);
  };

  useEffect(() => { if (id) loadThread(); }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !user) return;
    setSubmitting(true);

    const { error } = await supabase.from("forum_posts").insert({
      thread_id: id,
      user_id: user.id,
      content: reply.trim(),
    });

    if (error) {
      console.error(error);
      setSubmitting(false);
      return;
    }

    // Update thread updated_at
    await supabase.from("forum_threads").update({ updated_at: new Date().toISOString() }).eq("id", id);

    setReply("");
    setSubmitting(false);
    await loadThread();
    // Scroll to bottom
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const handleQuote = (username: string, content: string) => {
    setReply((prev) => prev + `[quote=${username}]\n${content.slice(0, 200)}\n[/quote]\n\n`);
    replyRef.current?.focus();
  };

  // Render quote tags
  const renderContent = (text: string) => {
    const quoteRegex = /\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = quoteRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex} style={{ whiteSpace: "pre-wrap" }}>{text.slice(lastIndex, match.index)}</span>
        );
      }
      parts.push(
        <div
          key={match.index}
          className="my-2 px-3 py-2 rounded"
          style={{ background: "hsl(220,42%,6%)", borderLeft: "3px solid hsl(43,65%,45%)", color: "hsl(215,20%,60%)" }}
        >
          <div className="font-cinzel text-xs mb-1" style={{ color: "hsl(43,65%,52%)" }}>{match[1]} schrieb:</div>
          <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{match[2].trim()}</div>
        </div>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={lastIndex} style={{ whiteSpace: "pre-wrap" }}>{text.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  };

  const threadAuthorPost: Post = thread ? {
    id: "op",
    content: thread.content,
    created_at: thread.created_at,
    updated_at: thread.updated_at,
    user_id: thread.user_id,
    username: posts.find(p => p.user_id === thread.user_id)?.username ?? "Unbekannt",
    postCount: posts.filter(p => p.user_id === thread.user_id).length + 1,
  } : null as any;

  const allPosts = thread ? [threadAuthorPost, ...posts] : posts;

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-cinzel mb-4 flex-wrap" style={{ color: "hsl(215,20%,45%)" }}>
            <Link to="/" className="hover:text-[hsl(43,65%,52%)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/forum" className="hover:text-[hsl(43,65%,52%)] transition-colors">Forum</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/forum/category/${category?.id}`} className="hover:text-[hsl(43,65%,52%)] transition-colors">
              {category?.name ?? "..."}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="truncate max-w-[200px]" style={{ color: "hsl(43,65%,52%)" }}>
              {thread?.title ?? "..."}
            </span>
          </div>

          {/* Thread Title */}
          {thread && (
            <div
              className="px-5 py-4 rounded-t-lg mb-0"
              style={{
                background: "linear-gradient(90deg, hsla(43,65%,22%,0.8) 0%, hsla(43,65%,15%,0.6) 100%)",
                border: "1px solid hsla(43,65%,40%,0.3)",
                borderBottom: "none",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-0.5">
                  {thread.pinned && <Pin className="w-4 h-4" style={{ color: "hsl(43,65%,52%)" }} />}
                  {thread.locked && <Lock className="w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />}
                </div>
                <div className="flex-1">
                  <h1 className="font-cinzel font-black text-xl" style={{ color: "hsl(43,75%,68%)" }}>
                    {thread.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" style={{ color: "hsl(215,20%,45%)" }} />
                      <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                        {posts.length} Antworten
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: "hsl(215,20%,45%)" }} />
                      <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                        {formatDate(thread.created_at)}
                      </span>
                    </div>
                    {thread.locked && (
                      <span
                        className="font-cinzel text-xs px-2 py-0.5 rounded"
                        style={{ background: "hsla(215,20%,30%,0.3)", color: "hsl(215,20%,60%)", border: "1px solid hsla(215,20%,30%,0.4)" }}
                      >
                        Geschlossen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="py-16 text-center rounded-b-lg" style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}>
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "hsl(43,65%,52%)" }} />
            </div>
          ) : (
            <div style={{ border: "1px solid hsl(220,30%,14%)", borderTop: thread ? "none" : undefined }}>
              {allPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="flex gap-0"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid hsl(220,30%,12%)",
                    background: i === 0 ? "hsl(220,42%,8%)" : i % 2 === 0 ? "hsl(220,42%,7%)" : "hsl(220,42%,6%)",
                  }}
                >
                  {/* User Panel – WBB3 left column */}
                  <div
                    className="flex flex-col items-center py-5 px-4 flex-shrink-0 w-32 sm:w-40"
                    style={{ borderRight: "1px solid hsl(220,30%,12%)", background: i === 0 ? "hsl(220,42%,10%)" : "hsl(220,42%,8%)" }}
                  >
                    <Avatar name={post.username ?? "?"} size={12} />
                    <div className="mt-2 text-center">
                      <div className="font-cinzel font-bold text-sm truncate max-w-full" style={{ color: "hsl(43,65%,58%)" }}>
                        {post.username}
                      </div>
                      {i === 0 && (
                        <div
                          className="font-cinzel text-xs mt-0.5 px-2 py-0.5 rounded-full"
                          style={{
                            background: "hsla(43,65%,52%,0.15)",
                            color: "hsl(43,65%,60%)",
                            border: "1px solid hsla(43,65%,52%,0.3)",
                          }}
                        >
                          OP
                        </div>
                      )}
                      <div className="font-cinzel text-xs mt-2" style={{ color: "hsl(215,20%,42%)" }}>
                        Beiträge
                      </div>
                      <div className="font-cinzel font-bold text-sm" style={{ color: "hsl(200,85%,60%)" }}>
                        {post.postCount ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Post Header */}
                    <div
                      className="flex items-center justify-between px-4 py-2 flex-wrap gap-2"
                      style={{ borderBottom: "1px solid hsl(220,30%,12%)", background: "hsla(220,30%,6%,0.5)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" style={{ color: "hsl(215,20%,38%)" }} />
                        <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,45%)" }}>
                          {formatDate(post.created_at)}
                        </span>
                        {i === 0 && (
                          <span
                            className="font-cinzel text-xs px-1.5 py-0.5 rounded ml-1"
                            style={{ background: "hsla(43,65%,52%,0.12)", color: "hsl(43,65%,60%)" }}
                          >
                            #1
                          </span>
                        )}
                        {i > 0 && (
                          <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,35%)" }}>#{i + 1}</span>
                        )}
                      </div>
                      {user && !thread?.locked && (
                        <button
                          onClick={() => handleQuote(post.username ?? "?", post.content)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-cinzel transition-colors"
                          style={{ color: "hsl(215,20%,48%)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(43,65%,52%)"; (e.currentTarget as HTMLElement).style.background = "hsla(43,65%,52%,0.08)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(215,20%,48%)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <Quote className="w-3.5 h-3.5" />
                          Zitieren
                        </button>
                      )}
                    </div>

                    {/* Post Body */}
                    <div className="px-4 py-4 flex-1">
                      <div className="text-sm leading-relaxed" style={{ color: "hsl(210,25%,82%)" }}>
                        {renderContent(post.content)}
                      </div>
                    </div>

                    {/* Post Footer */}
                    {post.updated_at !== post.created_at && (
                      <div
                        className="px-4 py-1.5"
                        style={{ borderTop: "1px solid hsl(220,30%,11%)" }}
                      >
                        <span className="text-xs italic" style={{ color: "hsl(215,20%,38%)" }}>
                          Zuletzt bearbeitet: {formatDate(post.updated_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Box */}
          {!loading && (
            <div className="mt-4">
              {thread?.locked ? (
                <div
                  className="px-5 py-4 rounded-lg flex items-center gap-3"
                  style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}
                >
                  <Lock className="w-5 h-5" style={{ color: "hsl(215,20%,45%)" }} />
                  <span className="font-cinzel text-sm" style={{ color: "hsl(215,20%,50%)" }}>
                    Dieses Thema ist geschlossen. Keine weiteren Antworten möglich.
                  </span>
                </div>
              ) : !user ? (
                <div
                  className="px-5 py-4 rounded-lg flex items-center gap-3"
                  style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}
                >
                  <Shield className="w-5 h-5" style={{ color: "hsl(200,85%,55%)" }} />
                  <span className="font-cinzel text-sm" style={{ color: "hsl(215,20%,55%)" }}>
                    Du musst{" "}
                    <Link to="/login" className="hover:underline" style={{ color: "hsl(200,85%,65%)" }}>
                      angemeldet
                    </Link>{" "}
                    sein um zu antworten.
                  </span>
                </div>
              ) : (
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ border: "1px solid hsl(220,30%,14%)" }}
                >
                  {/* Reply Header */}
                  <div
                    className="px-4 py-2.5 flex items-center gap-2"
                    style={{
                      background: "linear-gradient(90deg, hsla(43,65%,22%,0.7) 0%, hsla(43,65%,15%,0.5) 100%)",
                      borderBottom: "1px solid hsla(43,65%,40%,0.25)",
                    }}
                  >
                    <MessageSquare className="w-4 h-4" style={{ color: "hsl(43,65%,58%)" }} />
                    <span className="font-cinzel font-bold text-sm" style={{ color: "hsl(43,75%,68%)" }}>
                      ANTWORT VERFASSEN
                    </span>
                  </div>

                  <div
                    className="flex gap-0"
                    style={{ background: "hsl(220,42%,7%)" }}
                  >
                    {/* User panel */}
                    <div
                      className="flex flex-col items-center py-5 px-4 flex-shrink-0 w-32 sm:w-40"
                      style={{ borderRight: "1px solid hsl(220,30%,12%)", background: "hsl(220,42%,9%)" }}
                    >
                      <Avatar name={user.username ?? "?"} size={12} />
                      <div className="mt-2 font-cinzel font-bold text-sm text-center" style={{ color: "hsl(43,65%,58%)" }}>
                        {user.username}
                      </div>
                    </div>

                    {/* Text area */}
                    <form onSubmit={handleReply} className="flex-1 p-4 flex flex-col gap-3">
                      <textarea
                        ref={replyRef}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Deine Antwort..."
                        rows={6}
                        required
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-y"
                        style={{
                          background: "hsl(220,42%,6%)",
                          border: "1px solid hsl(220,30%,16%)",
                          color: "hsl(210,40%,88%)",
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,40%)")}
                        onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,16%)")}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting || !reply.trim()}
                          className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Antworten
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForumThread;
