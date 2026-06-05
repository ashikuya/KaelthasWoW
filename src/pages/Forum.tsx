import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare, Users, Clock, ChevronRight, Pin, Lock,
  TrendingUp, BookOpen, BarChart2, Eye
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  threadCount?: number;
  postCount?: number;
  lastThread?: {
    id: string;
    title: string;
    created_at: string;
    username?: string;
  } | null;
}

interface ForumStats {
  totalThreads: number;
  totalPosts: number;
  totalMembers: number;
  onlineCount: number;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "Gerade eben";
  if (diffH < 24) return `vor ${diffH}h`;
  if (diffH < 48) return "Gestern";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

const Forum = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ForumStats>({ totalThreads: 0, totalPosts: 0, totalMembers: 0, onlineCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Load categories
      const { data: cats } = await supabase
        .from("forum_categories")
        .select("*")
        .order("sort_order");

      if (cats) {
        // For each category load thread/post counts + last thread
        const enriched = await Promise.all(
          cats.map(async (cat) => {
            const { count: threadCount } = await supabase
              .from("forum_threads")
              .select("*", { count: "exact", head: true })
              .eq("category_id", cat.id);

            const { data: lastThreadData } = await supabase
              .from("forum_threads")
              .select("id, title, created_at, user_id")
              .eq("category_id", cat.id)
              .order("updated_at", { ascending: false })
              .limit(1);

            let lastThread = null;
            if (lastThreadData && lastThreadData[0]) {
              const t = lastThreadData[0];
              // get username
              const { data: profile } = await supabase
                .from("user_profiles")
                .select("username")
                .eq("id", t.user_id)
                .single();
              lastThread = { ...t, username: profile?.username ?? "Unbekannt" };
            }

            // post count for category threads
            const { data: threadIds } = await supabase
              .from("forum_threads")
              .select("id")
              .eq("category_id", cat.id);

            let postCount = 0;
            if (threadIds && threadIds.length > 0) {
              const ids = threadIds.map((t) => t.id);
              const { count } = await supabase
                .from("forum_posts")
                .select("*", { count: "exact", head: true })
                .in("thread_id", ids);
              postCount = count ?? 0;
            }

            return { ...cat, threadCount: threadCount ?? 0, postCount, lastThread };
          })
        );
        setCategories(enriched);
      }

      // Forum stats
      const [{ count: threads }, { count: posts }, { count: members }] = await Promise.all([
        supabase.from("forum_threads").select("*", { count: "exact", head: true }),
        supabase.from("forum_posts").select("*", { count: "exact", head: true }),
        supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalThreads: threads ?? 0,
        totalPosts: posts ?? 0,
        totalMembers: members ?? 0,
        onlineCount: 0,
      });

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-cinzel mb-3" style={{ color: "hsl(215,20%,45%)" }}>
              <Link to="/" className="hover:text-[hsl(43,65%,52%)] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: "hsl(43,65%,52%)" }}>Forum</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-cinzel font-black text-3xl text-glow-gold" style={{ color: "hsl(43,65%,58%)" }}>
                  KAELTHAS FORUM
                </h1>
                <p className="font-cinzel text-sm mt-1" style={{ color: "hsl(215,20%,50%)" }}>
                  Community · Guides · Support · Diskussionen
                </p>
              </div>
              {user && (
                <Link
                  to="/forum/new"
                  className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Neues Thema
                </Link>
              )}
            </div>
          </div>

          {/* Forum Stats Bar – WBB3 style */}
          <div
            className="flex items-center gap-6 px-4 py-3 rounded-lg mb-6 flex-wrap gap-y-2"
            style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}
          >
            {[
              { icon: BookOpen, label: "Themen", value: stats.totalThreads },
              { icon: MessageSquare, label: "Beiträge", value: stats.totalPosts },
              { icon: Users, label: "Mitglieder", value: stats.totalMembers },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color: "hsl(43,65%,52%)" }} />
                <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,55%)" }}>{label}:</span>
                <span className="font-cinzel text-xs font-bold" style={{ color: "hsl(43,65%,62%)" }}>{value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Category Boards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-lg animate-pulse" style={{ background: "hsl(220,42%,8%)" }} />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((cat) => (
                <div key={cat.id}>
                  {/* Category Board – WBB3 style */}
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{ border: "1px solid hsl(220,30%,14%)" }}
                  >
                    {/* Category Header */}
                    <div
                      className="flex items-center px-4 py-2.5"
                      style={{
                        background: cat.color === "gold"
                          ? "linear-gradient(90deg, hsla(43,65%,25%,0.8) 0%, hsla(43,65%,18%,0.6) 100%)"
                          : "linear-gradient(90deg, hsla(200,70%,20%,0.8) 0%, hsla(200,70%,14%,0.6) 100%)",
                        borderBottom: `1px solid ${cat.color === "gold" ? "hsla(43,65%,40%,0.3)" : "hsla(200,70%,40%,0.3)"}`,
                      }}
                    >
                      <span className="font-cinzel font-bold text-sm" style={{ color: cat.color === "gold" ? "hsl(43,75%,68%)" : "hsl(200,90%,68%)" }}>
                        {cat.name}
                      </span>
                    </div>

                    {/* Forum Row – WBB3 Table style */}
                    <div
                      className="grid items-center px-4 py-3.5 gap-3 hover:brightness-110 transition-all"
                      style={{
                        gridTemplateColumns: "auto 1fr auto auto auto",
                        background: "hsl(220,42%,7%)",
                      }}
                    >
                      {/* Forum Icon */}
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: cat.color === "gold" ? "hsla(43,65%,52%,0.12)" : "hsla(200,85%,55%,0.12)",
                          border: `1px solid ${cat.color === "gold" ? "hsla(43,65%,52%,0.25)" : "hsla(200,85%,55%,0.25)"}`,
                        }}
                      >
                        <MessageSquare
                          className="w-5 h-5"
                          style={{ color: cat.color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }}
                        />
                      </div>

                      {/* Forum Name + Description */}
                      <div className="min-w-0">
                        <Link
                          to={`/forum/category/${cat.id}`}
                          className="font-cinzel font-semibold text-sm hover:text-[hsl(43,65%,58%)] transition-colors"
                          style={{ color: "hsl(210,40%,88%)" }}
                        >
                          {cat.name}
                        </Link>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "hsl(215,20%,45%)" }}>
                          {cat.description}
                        </p>
                      </div>

                      {/* Thread Count */}
                      <div className="text-center hidden sm:block w-16">
                        <div className="font-cinzel font-bold text-sm" style={{ color: "hsl(210,40%,80%)" }}>
                          {cat.threadCount}
                        </div>
                        <div className="font-cinzel text-xs" style={{ color: "hsl(215,20%,42%)" }}>Themen</div>
                      </div>

                      {/* Post Count */}
                      <div className="text-center hidden sm:block w-16">
                        <div className="font-cinzel font-bold text-sm" style={{ color: "hsl(210,40%,80%)" }}>
                          {cat.postCount}
                        </div>
                        <div className="font-cinzel text-xs" style={{ color: "hsl(215,20%,42%)" }}>Beiträge</div>
                      </div>

                      {/* Last Post */}
                      <div className="hidden md:flex flex-col items-end min-w-[160px] max-w-[200px]">
                        {cat.lastThread ? (
                          <>
                            <Link
                              to={`/forum/thread/${cat.lastThread.id}`}
                              className="text-xs font-cinzel truncate max-w-full hover:text-[hsl(43,65%,58%)] transition-colors"
                              style={{ color: "hsl(200,85%,65%)" }}
                            >
                              {cat.lastThread.title.length > 28 ? cat.lastThread.title.slice(0, 25) + "…" : cat.lastThread.title}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-2.5 h-2.5" style={{ color: "hsl(215,20%,40%)" }} />
                              <span className="text-xs" style={{ color: "hsl(215,20%,42%)" }}>
                                {formatDate(cat.lastThread.created_at)} · {cat.lastThread.username}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>Noch kein Beitrag</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Who's Online + Legend – WBB3 footer style */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div
              className="rounded-lg p-4"
              style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}
            >
              <div
                className="font-cinzel font-bold text-xs tracking-wider mb-3 pb-2"
                style={{ color: "hsl(43,65%,58%)", borderBottom: "1px solid hsl(220,30%,14%)" }}
              >
                ONLINE BENUTZER
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[hsl(120,60%,50%)] animate-pulse" />
                  <span className="font-cinzel text-xs" style={{ color: "hsl(120,60%,55%)" }}>
                    {user.username}
                  </span>
                </div>
              ) : (
                <p className="text-xs" style={{ color: "hsl(215,20%,42%)" }}>
                  Bitte{" "}
                  <Link to="/login" className="hover:underline" style={{ color: "hsl(200,85%,65%)" }}>
                    anmelden
                  </Link>{" "}
                  um den Online-Status zu sehen.
                </p>
              )}
            </div>

            <div
              className="rounded-lg p-4"
              style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)" }}
            >
              <div
                className="font-cinzel font-bold text-xs tracking-wider mb-3 pb-2"
                style={{ color: "hsl(43,65%,58%)", borderBottom: "1px solid hsl(220,30%,14%)" }}
              >
                LEGENDE
              </div>
              <div className="space-y-1.5">
                {[
                  { icon: Pin, color: "hsl(43,65%,52%)", label: "Angepinnt" },
                  { icon: Lock, color: "hsl(215,20%,48%)", label: "Geschlossen" },
                  { icon: TrendingUp, color: "hsl(120,60%,50%)", label: "Aktives Thema" },
                ].map(({ icon: Icon, color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,50%)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Forum;
