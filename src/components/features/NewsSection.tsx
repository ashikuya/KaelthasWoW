import { Newspaper, Calendar, Tag, ChevronRight, Sword, Shield, Zap } from "lucide-react";

const news = [
  {
    id: 1,
    category: "UPDATE",
    categoryColor: "hsl(200,85%,55%)",
    categoryBg: "hsla(200,85%,55%,0.12)",
    icon: Zap,
    title: "Server-Patch 1.2.0 – Ulduar Heroic freigeschaltet",
    excerpt: "Alle Heroic-Modi in Ulduar sind ab sofort verfügbar. Neue Loottabellen, verbesserte Bossmechaniken und exklusive Titel erwarten euch.",
    date: "02. Jun 2026",
    featured: true,
  },
  {
    id: 2,
    category: "EVENT",
    categoryColor: "hsl(43,65%,52%)",
    categoryBg: "hsla(43,65%,52%,0.12)",
    icon: Sword,
    title: "Sommerfestival – Doppelte XP Wochenende",
    excerpt: "Dieses Wochenende gibt es doppelte Erfahrungspunkte! Nutze die Chance und bringe deinen Charakter auf das nächste Level.",
    date: "29. Mai 2026",
    featured: false,
  },
  {
    id: 3,
    category: "HOTFIX",
    categoryColor: "hsl(120,60%,50%)",
    categoryBg: "hsla(120,60%,50%,0.12)",
    icon: Shield,
    title: "Bugfix – ICC Loot-Verteilung korrigiert",
    excerpt: "Ein Fehler bei der Master-Loot-Verteilung in Icecrown Citadel wurde behoben. Alle Spieler erhalten nun korrekt ihre Items.",
    date: "25. Mai 2026",
    featured: false,
  },
];

const NewsSection = () => {
  return (
    <section id="news" className="py-24" style={{ background: "hsl(222,47%,4%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-4">
              <Newspaper className="w-3 h-3 text-[hsl(43,65%,52%)]" />
              <span className="font-cinzel text-xs tracking-widest text-[hsl(43,65%,52%)]">
                NEWS & UPDATES
              </span>
            </div>
            <h2
              className="font-cinzel font-bold"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                background: "linear-gradient(180deg, hsl(210,40%,96%) 0%, hsl(215,20%,70%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Aktuelle News
            </h2>
          </div>
          <button
            className="flex items-center gap-2 font-cinzel text-sm tracking-wider transition-colors"
            style={{ color: "hsl(200,85%,55%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(200,85%,72%)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(200,85%,55%)")}
          >
            Alle News
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {news.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col ${
                  idx === 0 ? "lg:col-span-1" : ""
                }`}
                style={{
                  borderColor: idx === 0 ? "hsla(43,65%,52%,0.35)" : undefined,
                  boxShadow: idx === 0 ? "0 0 30px hsla(43,65%,52%,0.06)" : undefined,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${item.categoryColor}, transparent)`,
                  }}
                />

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-2 px-2.5 py-1 rounded-full"
                      style={{
                        background: item.categoryBg,
                        border: `1px solid ${item.categoryColor}44`,
                      }}
                    >
                      <Icon className="w-3 h-3" style={{ color: item.categoryColor }} />
                      <span
                        className="font-cinzel text-xs tracking-widest"
                        style={{ color: item.categoryColor }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: "hsl(215,20%,42%)" }}>
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-cinzel">{item.date}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="font-cinzel font-bold text-base mb-2 leading-snug group-hover:text-[hsl(43,65%,58%)] transition-colors"
                      style={{ color: "hsl(210,40%,90%)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "hsl(215,20%,52%)" }}
                    >
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Read more */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors group-hover:gap-2.5"
                    style={{ color: "hsl(215,20%,45%)" }}
                  >
                    <Tag className="w-3 h-3" />
                    Weiterlesen
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
