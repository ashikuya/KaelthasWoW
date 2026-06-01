import { useState } from "react";
import { Newspaper, ChevronRight, Clock, Tag, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const newsItems = [
  {
    id: 1,
    category: "Update",
    categoryColor: "hsl(200,85%,55%)",
    categoryBg: "hsla(200,85%,55%,0.12)",
    categoryBorder: "hsla(200,85%,55%,0.3)",
    title: "Icecrown Citadel – Phase 2 jetzt verfügbar!",
    excerpt: "Die Türen der Eiskronenzitadelle öffnen sich weiter. Lich King Heroic Mode ist jetzt freigeschaltet. Bereite dich auf den Kampf der Legenden vor.",
    date: "01. Jun 2026",
    author: "Kaelthas Team",
  },
  {
    id: 2,
    category: "Event",
    categoryColor: "hsl(43,65%,52%)",
    categoryBg: "hsla(43,65%,52%,0.12)",
    categoryBorder: "hsla(43,65%,52%,0.3)",
    title: "Midsummer Fire Festival – Doppel-XP Wochenende",
    excerpt: "Feiere das Midsummer Fire Festival mit uns! Dieses Wochenende erhaltet ihr doppelte Erfahrungspunkte auf alle Aktivitäten. Event läuft 48h.",
    date: "28. Mai 2026",
    author: "Kaelthas Team",
  },
  {
    id: 3,
    category: "Hotfix",
    categoryColor: "hsl(120,60%,48%)",
    categoryBg: "hsla(120,60%,48%,0.12)",
    categoryBorder: "hsla(120,60%,48%,0.3)",
    title: "Bugfix Patch 3.3.5a-r14 – Arena & BG Fixes",
    excerpt: "Wichtige Bugfixes für Arena und Battlegrounds wurden eingespielt. Mehrere Klassen-Bugs für DK und Paladin wurden behoben. Changelog im Forum.",
    date: "22. Mai 2026",
    author: "Kaelthas Dev",
  },
  {
    id: 4,
    category: "Ankündigung",
    categoryColor: "hsl(280,70%,65%)",
    categoryBg: "hsla(280,70%,65%,0.12)",
    categoryBorder: "hsla(280,70%,65%,0.3)",
    title: "Server Wartung – Montag 02:00–04:00 Uhr",
    excerpt: "Am kommenden Montag findet eine geplante Wartung statt. Wir spielen wichtige Performance-Verbesserungen und Datenbankoptimierungen ein.",
    date: "20. Mai 2026",
    author: "Kaelthas Admin",
  },
  {
    id: 5,
    category: "Update",
    categoryColor: "hsl(200,85%,55%)",
    categoryBg: "hsla(200,85%,55%,0.12)",
    categoryBorder: "hsla(200,85%,55%,0.3)",
    title: "Neue Custom Items im Vote-Shop verfügbar",
    excerpt: "14 neue exklusive Transmog-Items und 3 Custom Mounts wurden dem Vote-Shop hinzugefügt. Vote täglich und sammle Punkte für einzigartige Belohnungen.",
    date: "15. Mai 2026",
    author: "Kaelthas Team",
  },
  {
    id: 6,
    category: "Event",
    categoryColor: "hsl(43,65%,52%)",
    categoryBg: "hsla(43,65%,52%,0.12)",
    categoryBorder: "hsla(43,65%,52%,0.3)",
    title: "PvP Turnier – 2v2 Arena Championship",
    excerpt: "Meldet euch jetzt für das erste Kaelthas 2v2 Arena Turnier an! Preispool: Exklusive Mounts, Titel und Vote-Punkte. Anmeldung bis 10. Juni.",
    date: "10. Mai 2026",
    author: "Kaelthas Team",
  },
];

const ITEMS_PER_PAGE = 3;

const NewsSection = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const visibleNews = newsItems.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  return (
    <section id="news" className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-4">
              <Newspaper className="w-3 h-3 text-[hsl(43,65%,52%)]" />
              <span className="font-cinzel text-xs tracking-widest text-[hsl(43,65%,52%)]">
                SERVER NEWS
              </span>
            </div>
            <h2
              className="font-cinzel font-bold"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                background: "linear-gradient(180deg, hsl(210,40%,96%) 0%, hsl(215,20%,70%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Neueste Nachrichten
            </h2>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: "hsl(220,42%,9%)",
                  border: "1px solid hsl(220,30%,18%)",
                  color: "hsl(215,20%,60%)",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: "hsl(220,42%,9%)",
                  border: "1px solid hsl(220,30%,18%)",
                  color: "hsl(215,20%,60%)",
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="divider-gold mb-10" />

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleNews.map((item, idx) => (
            <article
              key={item.id}
              className={`glass-card rounded-xl overflow-hidden flex flex-col group hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                idx === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
              style={{
                borderColor:
                  idx === 0
                    ? "hsla(43,65%,52%,0.35)"
                    : "hsla(220,30%,20%,0.5)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = item.categoryColor.replace(")", ",0.5)").replace("hsl", "hsla");
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  idx === 0 ? "hsla(43,65%,52%,0.35)" : "hsla(220,30%,20%,0.5)";
              }}
            >
              {/* Category bar */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, ${item.categoryColor}, transparent)` }}
              />

              <div className={`p-5 flex flex-col gap-3 flex-1 ${idx === 0 ? "md:p-6" : ""}`}>
                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="font-cinzel text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    style={{
                      color: item.categoryColor,
                      background: item.categoryBg,
                      border: `1px solid ${item.categoryBorder}`,
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "hsl(215,20%,45%)" }}
                  >
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`font-cinzel font-bold leading-snug group-hover:text-[hsl(43,65%,60%)] transition-colors ${
                    idx === 0 ? "text-xl md:text-2xl" : "text-base"
                  }`}
                  style={{ color: "hsl(210,40%,92%)" }}
                >
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "hsl(215,20%,52%)" }}
                >
                  {item.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "hsl(220,30%,14%)" }}>
                  <span className="text-xs" style={{ color: "hsl(215,20%,40%)" }}>
                    von {item.author}
                  </span>
                  <button
                    className="flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors group-hover:text-[hsl(43,65%,58%)]"
                    style={{ color: "hsl(215,20%,50%)" }}
                  >
                    Mehr lesen
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
