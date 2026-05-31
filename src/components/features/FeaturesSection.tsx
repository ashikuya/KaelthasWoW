import { Shield, Sword, Zap, Heart, Globe, Trophy, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Anti-Cheat System",
    description: "Modernste Schutzmaßnahmen gegen Cheater und Exploiter für ein faires Spielerlebnis.",
    color: "gold",
  },
  {
    icon: Sword,
    title: "Alle Raids verfügbar",
    description: "ICC, ToC, Ulduar, Naxxramas, OS – vollständig geskriptet mit korrekten Mechaniken.",
    color: "frost",
  },
  {
    icon: Zap,
    title: "Perfekte Performance",
    description: "Dedizierter Server in Deutschland mit niedrigstem Ping und höchster Stabilität.",
    color: "gold",
  },
  {
    icon: Heart,
    title: "Aktive Entwicklung",
    description: "Regelmäßige Updates, Bugfixes und neue Inhalte durch unser engagiertes Team.",
    color: "frost",
  },
  {
    icon: Globe,
    title: "Internationale Community",
    description: "Deutsche und englischsprachige Spieler willkommen. Mehrsprachiger Support.",
    color: "gold",
  },
  {
    icon: Trophy,
    title: "Season Events",
    description: "Regelmäßige Events, Turniere und saisonale Inhalte mit exklusiven Belohnungen.",
    color: "frost",
  },
  {
    icon: Users,
    title: "Gilden & PvP",
    description: "Voll funktionsfähiges Gilden-System, Arena, Battlegrounds und World PvP.",
    color: "gold",
  },
  {
    icon: Sparkles,
    title: "Custom Content",
    description: "Exklusive Custom Items, transmog-System und einzigartige Quests nur auf Kaelthas.",
    color: "frost",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-6">
            <Sword className="w-3 h-3 text-[hsl(43,65%,52%)]" />
            <span className="font-cinzel text-xs tracking-widest text-[hsl(43,65%,52%)]">
              SERVER FEATURES
            </span>
          </div>
          <h2
            className="font-cinzel font-bold mb-4"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              background: "linear-gradient(180deg, hsl(210,40%,96%) 0%, hsl(215,20%,70%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Warum Kaelthas?
          </h2>
          <div className="divider-gold max-w-48 mx-auto mb-4" />
          <p className="max-w-2xl mx-auto" style={{ color: "hsl(215,20%,55%)", lineHeight: 1.7 }}>
            Wir bieten ein authentisches Wrath of the Lich King Erlebnis
            mit modernster Server-Technologie und liebevoll gepflegtem Content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="glass-card rounded-xl p-6 group hover:scale-105 hover:border-opacity-60 transition-all duration-300 cursor-default"
              style={{
                borderColor:
                  color === "gold"
                    ? "hsla(43,65%,52%,0.2)"
                    : "hsla(200,85%,55%,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  color === "gold"
                    ? "hsla(43,65%,52%,0.5)"
                    : "hsla(200,85%,55%,0.5)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  color === "gold"
                    ? "0 0 20px hsla(43,65%,52%,0.1)"
                    : "0 0 20px hsla(200,85%,55%,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  color === "gold"
                    ? "hsla(43,65%,52%,0.2)"
                    : "hsla(200,85%,55%,0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    color === "gold"
                      ? "hsla(43,65%,52%,0.12)"
                      : "hsla(200,85%,55%,0.12)",
                  border: `1px solid ${
                    color === "gold"
                      ? "hsla(43,65%,52%,0.3)"
                      : "hsla(200,85%,55%,0.3)"
                  }`,
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color:
                      color === "gold"
                        ? "hsl(43,65%,52%)"
                        : "hsl(200,85%,55%)",
                  }}
                />
              </div>
              <h3
                className="font-cinzel font-semibold text-base mb-2"
                style={{ color: "hsl(210,40%,90%)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,52%)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
