import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MessageSquare, ChevronRight, Pin, Lock, Clock, Eye,
  Plus, User, TrendingUp, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Thread {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  locked: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  username?: string;
  replyCount?: number;
  lastReplyAt?: string;
  lastReplyUser?: string;
}

const THREADS_PER_PAGE = 20;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "Gerade eben";
  if (diffH < 24) return `vor ${diffH}h`;
  if (diffH < 48) return "Gestern";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const ForumCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<any>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Load category
      const { data: cat } = await supabase
        .from("forum_categories")
        .select("*")
        .eq("id", id)
        .single();
      setCategory(cat);

      // Total count
      const { count } = await supabase
        .from("forum_threads")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id);
      setTotal(count ?? 0);

      // Load threads with pagination - pinned first
      const { data: rawThreads } = await supabase
        .from("forum_threads")
        .select("*")
        .eq("category_id", id)
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false })
        .range(page * THREADS_PER_PAGE, (page + 1) * THREADS_PER_PAGE - 1);

      if (rawThreads) {
        const enriched = await Promise.all(
          rawThreads.map(async (t) => {
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("username")
              .eq("id", t.user_id)
              .single();

            const { count: replyCount, data: lastPost } = await supabase
              .from("forum_posts")
              .select("created_at, user_id", { count: "exact" })
              .eq("thread_id", t.id)
              .order("created_at", { ascending: false })
              .limit(1);

            let lastReplyUser = undefined;
            if (lastPost && lastPost[0]) {
              const { data: lp } = await supabase
                .from("user_profiles")
                .select("username")
                .eq("id", lastPost[0].user_id)
                .single();
              lastReplyUser = lp?.username;
            }

            return {
              ...t,
              username: profile?.username ?? "Unbekannt",
              replyCount: replyCount ?? 0,
              lastReplyAt: lastPost?.[0]?.created_at ?? t.updated_at,
              lastReplyUser,
            };
          })
        );
        setThreads(enriched);
      }
      setLoading(false);
    };

    if (id) load();
  }, [id, page]);

  const totalPages = Math.ceil(total / THREADS_PER_PAGE);

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-cinzel mb-4" style={{ color: "hsl(215,20%,45%)" }}>
            <Link to="/" className="hover:text-[hsl(43,65%,52%)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/forum" className="hover:text-[hsl(43,65%,52%)] transition-colors">Forum</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "hsl(43,65%,52%)" }}>{category?.name ?? "..."}</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="font-cinzel font-black text-2xl" style={{ color: "hsl(43,65%,58%)" }}>
                {category?.name ?? "Kategorie"}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "hsl(215,20%,50%)" }}>{category?.description}</p>
            </div>
            {user && (
              <Link
                to={`/forum/new?category=${id}`}
                className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Neues Thema
              </Link>
            )}
          </div>

          {/* Thread Table – WBB3 style */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid hsl(220,30%,14%)" }}>
            {/* Table Header */}
            <div
              className="grid px-4 py-2.5"
              style={{
                gridTemplateColumns: "auto 1fr 80px 80px 200px",
                background: "linear-gradient(90deg, hsla(43,65%,25%,0.8) 0%, hsla(43,65%,18%,0.6) 100%)",
                borderBottom: "1px solid hsla(43,65%,40%,0.3)",
              }}
            >
              <div className="w-8" />
              <span className="font-cinzel text-xs font-bold tracking-wider" style={{ color: "hsl(43,75%,68%)" }}>THEMA</span>
              <span className="font-cinzel text-xs font-bold tracking-wider text-center hidden sm:block" style={{ color: "hsl(43,75%,68%)" }}>ANTWORTEN</span>
              <span className="font-cinzel text-xs font-bold tracking-wider text-center hidden sm:block" style={{ color: "hsl(43,75%,68%)" }}>AUFRUFE</span>
              <span className="font-cinzel text-xs font-bold tracking-wider text-right hidden md:block" style={{ color: "hsl(43,75%,68%)" }}>LETZTER BEITRAG</span>
            </div>

            {/* Threads */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-[hsl(43,65%,52%)] border-[hsl(220,30%,20%)] animate-spin mx-auto" />
              </div>
            ) : threads.length === 0 ? (
              <div
                className="py-12 text-center"
                style={{ background: "hsl(220,42%,7%)" }}
              >
                <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(215,20%,30%)" }} />
                <p className="font-cinzel text-sm" style={{ color: "hsl(215,20%,50%)" }}>Noch keine Themen</p>
                {user && (
                  <Link to={`/forum/new?category=${id}`} className="inline-block mt-3 btn-gold px-4 py-2 rounded text-xs">
                    Erstes Thema erstellen
                  </Link>
                )}
              </div>
            ) : (
              threads.map((thread, i) => (
                <div
                  key={thread.id}
                  className="grid items-center px-4 py-3 gap-3 hover:brightness-110 transition-all"
                  style={{
                    gridTemplateColumns: "auto 1fr 80px 80px 200px",
                    background: i % 2 === 0 ? "hsl(220,42%,7%)" : "hsl(220,42%,6%)",
                    borderTop: i === 0 ? "none" : "1px solid hsl(220,30%,11%)",
                  }}
                >
                  {/* Status Icon */}
                  <div className="w-8 flex flex-col items-center gap-0.5">
                    {thread.pinned && <Pin className="w-3 h-3" style={{ color: "hsl(43,65%,52%)" }} />}
                    {thread.locked && <Lock className="w-3 h-3" style={{ color: "hsl(215,20%,45%)" }} />}
                    {!thread.pinned && !thread.locked && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: (thread.replyCount ?? 0) > 5
                            ? "hsl(120,60%,50%)"
                            : "hsl(43,65%,52%)",
                        }}
                      />
                    )}
                  </div>

                  {/* Title + Author */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {thread.pinned && (
                        <span
                          className="font-cinzel text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "hsla(43,65%,52%,0.15)", color: "hsl(43,65%,60%)", border: "1px solid hsla(43,65%,52%,0.3)" }}
                        >
                          Angepinnt
                        </span>
                      )}
                      {thread.locked && (
                        <span
                          className="font-cinzel text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "hsla(215,20%,30%,0.3)", color: "hsl(215,20%,55%)", border: "1px solid hsla(215,20%,30%,0.3)" }}
                        >
                          Geschlossen
                        </span>
                      )}
                      <Link
                        to={`/forum/thread/${thread.id}`}
                        className="font-cinzel font-semibold text-sm hover:text-[hsl(43,65%,58%)] transition-colors truncate"
                        style={{ color: "hsl(210,40%,90%)" }}
                      >
                        {thread.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-2.5 h-2.5" style={{ color: "hsl(215,20%,40%)" }} />
                      <span className="text-xs" style={{ color: "hsl(215,20%,45%)" }}>{thread.username}</span>
                      <span style={{ color: "hsl(215,20%,30%)" }}>·</span>
                      <span className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>{formatDate(thread.created_at)}</span>
                    </div>
                  </div>

                  {/* Reply Count */}
                  <div className="text-center hidden sm:block">
                    <span className="font-cinzel font-bold text-sm" style={{ color: "hsl(210,40%,75%)" }}>
                      {thread.replyCount}
                    </span>
                  </div>

                  {/* Views */}
                  <div className="text-center hidden sm:block">
                    <span className="font-cinzel text-sm" style={{ color: "hsl(215,20%,50%)" }}>
                      {thread.views}
                    </span>
                  </div>

                  {/* Last Reply */}
                  <div className="hidden md:flex flex-col items-end">
                    {thread.lastReplyUser ? (
                      <>
                        <span className="font-cinzel text-xs" style={{ color: "hsl(200,85%,60%)" }}>
                          {thread.lastReplyUser}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" style={{ color: "hsl(215,20%,38%)" }} />
                          <span className="text-xs" style={{ color: "hsl(215,20%,40%)" }}>
                            {formatDate(thread.lastReplyAt ?? thread.updated_at)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>
                        {formatDate(thread.updated_at)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,45%)" }}>
                Seite {page + 1} von {totalPages} · {total} Themen
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded text-xs font-cinzel transition-all disabled:opacity-30"
                  style={{ background: "hsl(220,42%,10%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(215,20%,65%)" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className="w-8 h-8 rounded text-xs font-cinzel transition-all"
                    style={{
                      background: page === i ? "hsl(43,65%,45%)" : "hsl(220,42%,10%)",
                      border: page === i ? "1px solid hsl(43,75%,55%)" : "1px solid hsl(220,30%,18%)",
                      color: page === i ? "hsl(220,47%,5%)" : "hsl(215,20%,65%)",
                      fontWeight: page === i ? 700 : 400,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded text-xs font-cinzel transition-all disabled:opacity-30"
                  style={{ background: "hsl(220,42%,10%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(215,20%,65%)" }}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForumCategory;
