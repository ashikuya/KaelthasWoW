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
    <section id="features" className="py-28 relative overflow-hidden" style={{ background: "hsl(222,47%,4%)" }}>
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none features-grid-bg" />

      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(43,65%,52%,0.04) 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
          animation: "orb-drift 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(200,85%,55%,0.04) 0%, transparent 70%)",
          bottom: "-80px",
          right: "-80px",
          animation: "orb-drift 15s ease-in-out 3s infinite reverse",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-6 backdrop-blur-sm">
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
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <div
              key={title}
              className="feature-card group relative overflow-hidden rounded-xl p-6 cursor-default"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-30"
                style={{
                  background: `radial-gradient(circle at top left, ${color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)"}, transparent 70%)`,
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-40"
                style={{
                  background: `radial-gradient(circle at bottom right, ${color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)"}, transparent 70%)`,
                }}
              />

              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  boxShadow: color === "gold"
                    ? "inset 0 0 20px hsla(43,65%,52%,0.08), 0 0 20px hsla(43,65%,52%,0.06)"
                    : "inset 0 0 20px hsla(200,85%,55%,0.08), 0 0 20px hsla(200,85%,55%,0.06)",
                }}
              />

              <div className="relative z-10">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: color === "gold" ? "hsla(43,65%,52%,0.12)" : "hsla(200,85%,55%,0.12)",
                    border: `1px solid ${color === "gold" ? "hsla(43,65%,52%,0.3)" : "hsla(200,85%,55%,0.3)"}`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }}
                  />
                </div>
                <h3 className="font-cinzel font-semibold text-base mb-2 transition-colors duration-300 group-hover:text-[hsl(43,75%,68%)]" style={{ color: "hsl(210,40%,90%)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,52%)" }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
