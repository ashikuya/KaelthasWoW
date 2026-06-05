import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Send, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const ForumNewThread = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState(searchParams.get("category") ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("forum_categories").select("*").order("sort_order").then(({ data }) => {
      if (data) setCategories(data);
      if (!categoryId && data && data[0]) setCategoryId(data[0].id);
    });
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;
    setSubmitting(true);

    const { data, error } = await supabase.from("forum_threads").insert({
      category_id: categoryId,
      user_id: user!.id,
      title: title.trim(),
      content: content.trim(),
    }).select("id").single();

    if (error || !data) {
      toast.error("Fehler beim Erstellen: " + error?.message);
      setSubmitting(false);
      return;
    }

    toast.success("Thema erstellt!");
    navigate(`/forum/thread/${data.id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-cinzel mb-5" style={{ color: "hsl(215,20%,45%)" }}>
            <Link to="/" className="hover:text-[hsl(43,65%,52%)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/forum" className="hover:text-[hsl(43,65%,52%)] transition-colors">Forum</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "hsl(43,65%,52%)" }}>Neues Thema</span>
          </div>

          {/* Form */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid hsl(220,30%,14%)" }}>
            {/* Header */}
            <div
              className="px-5 py-3.5 flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg, hsla(43,65%,22%,0.8) 0%, hsla(43,65%,15%,0.6) 100%)",
                borderBottom: "1px solid hsla(43,65%,40%,0.3)",
              }}
            >
              <Send className="w-4 h-4" style={{ color: "hsl(43,65%,58%)" }} />
              <span className="font-cinzel font-bold text-sm" style={{ color: "hsl(43,75%,68%)" }}>
                NEUES THEMA ERSTELLEN
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5" style={{ background: "hsl(220,42%,7%)" }}>
              {/* Category */}
              <div>
                <label className="block font-cinzel text-xs tracking-wider mb-2" style={{ color: "hsl(215,20%,55%)" }}>
                  KATEGORIE
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "hsl(220,42%,9%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,88%)" }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-cinzel text-xs tracking-wider mb-2" style={{ color: "hsl(215,20%,55%)" }}>
                  TITEL
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel des Themas"
                  required
                  maxLength={200}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "hsl(220,42%,9%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,88%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                />
                <div className="text-right mt-1 font-cinzel text-xs" style={{ color: "hsl(215,20%,38%)" }}>
                  {title.length}/200
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block font-cinzel text-xs tracking-wider mb-2" style={{ color: "hsl(215,20%,55%)" }}>
                  INHALT
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Schreibe deinen Beitrag..."
                  required
                  rows={12}
                  className="w-full px-3 py-3 rounded-lg text-sm outline-none transition-all resize-y"
                  style={{
                    background: "hsl(220,42%,9%)",
                    border: "1px solid hsl(220,30%,18%)",
                    color: "hsl(210,40%,88%)",
                    lineHeight: 1.7,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  to={categoryId ? `/forum/category/${categoryId}` : "/forum"}
                  className="flex items-center gap-2 font-cinzel text-sm transition-colors"
                  style={{ color: "hsl(215,20%,50%)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(200,85%,60%)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(215,20%,50%)")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Abbrechen
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !content.trim()}
                  className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Thema veröffentlichen
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForumNewThread;
