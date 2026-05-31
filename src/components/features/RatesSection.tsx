import { Zap, Star, Coins, Package } from "lucide-react";

const rates = [
  {
    icon: Zap,
    label: "XP Rate",
    value: "x5",
    description: "Levele schnell zum Maximum und erlebe alle Inhalte",
    color: "gold",
  },
  {
    icon: Star,
    label: "Drop Rate",
    value: "x3",
    description: "Verbesserte Dropchancen für Items und Materialien",
    color: "frost",
  },
  {
    icon: Coins,
    label: "Gold Rate",
    value: "x5",
    description: "Erhöhte Gold-Drops für ein besseres Wirtschaftserlebnis",
    color: "gold",
  },
  {
    icon: Package,
    label: "Profession Rate",
    value: "x5",
    description: "Berufe schneller leveln und Crafting genießen",
    color: "frost",
  },
];

const expansions = [
  { name: "Classic / Vanilla", status: "available", color: "gold" },
  { name: "The Burning Crusade", status: "available", color: "gold" },
  { name: "Wrath of the Lich King", status: "current", color: "frost" },
  { name: "Icecrown Citadel", status: "available", color: "frost" },
  { name: "Trial of the Crusader", status: "available", color: "gold" },
  { name: "Ulduar", status: "available", color: "gold" },
];

const RatesSection = () => {
  return (
    <section id="rates" className="py-24" style={{ background: "hsl(220,50%,5%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(200,85%,55%)]/30 bg-[hsl(200,85%,55%)]/8 mb-6">
            <Star className="w-3 h-3 text-[hsl(200,85%,55%)]" />
            <span className="font-cinzel text-xs tracking-widest text-[hsl(200,85%,55%)]">
              SERVER RATEN
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
            Raten & Progression
          </h2>
          <div className="divider-frost max-w-48 mx-auto mb-4" />
          <p className="max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)", lineHeight: 1.7 }}>
            Ausgewogene Raten die Progression spannend machen ohne übermäßig langweilig zu werden.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Rates Cards */}
          <div>
            <h3 className="font-cinzel font-semibold text-xl mb-6" style={{ color: "hsl(43,65%,52%)" }}>
              Gameplay Raten
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {rates.map(({ icon: Icon, label, value, description, color }) => (
                <div
                  key={label}
                  className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:scale-105 transition-transform duration-300"
                  style={{
                    borderColor:
                      color === "gold"
                        ? "hsla(43,65%,52%,0.25)"
                        : "hsla(200,85%,55%,0.25)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color:
                          color === "gold"
                            ? "hsl(43,65%,52%)"
                            : "hsl(200,85%,55%)",
                      }}
                    />
                    <span
                      className="rate-badge text-2xl"
                      style={{
                        background:
                          color === "gold"
                            ? "linear-gradient(135deg, hsl(43,65%,45%), hsl(43,75%,62%))"
                            : "linear-gradient(135deg, hsl(200,75%,45%), hsl(200,85%,65%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                  <div>
                    <div className="font-cinzel font-semibold text-sm mb-1" style={{ color: "hsl(210,40%,88%)" }}>
                      {label}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "hsl(215,20%,50%)" }}>
                      {description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Available */}
          <div>
            <h3 className="font-cinzel font-semibold text-xl mb-6" style={{ color: "hsl(200,85%,55%)" }}>
              Verfügbarer Content
            </h3>
            <div className="space-y-3">
              {expansions.map(({ name, status, color }) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-4 rounded-lg glass-card"
                  style={{
                    borderColor:
                      status === "current"
                        ? "hsla(200,85%,55%,0.4)"
                        : "hsla(220,30%,18%,0.6)",
                    background:
                      status === "current"
                        ? "hsla(200,60%,8%,0.8)"
                        : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          status === "current"
                            ? "hsl(200,85%,55%)"
                            : color === "gold"
                            ? "hsl(43,65%,52%)"
                            : "hsl(200,85%,55%)",
                        boxShadow:
                          status === "current"
                            ? "0 0 8px hsl(200,85%,55%)"
                            : undefined,
                      }}
                    />
                    <span
                      className="font-cinzel text-sm"
                      style={{
                        color:
                          status === "current"
                            ? "hsl(200,85%,72%)"
                            : "hsl(210,40%,80%)",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                  <span
                    className="font-cinzel text-xs px-3 py-1 rounded-full"
                    style={{
                      color:
                        status === "current"
                          ? "hsl(200,85%,55%)"
                          : "hsl(43,65%,52%)",
                      background:
                        status === "current"
                          ? "hsla(200,85%,55%,0.15)"
                          : "hsla(43,65%,52%,0.12)",
                      border: `1px solid ${
                        status === "current"
                          ? "hsla(200,85%,55%,0.3)"
                          : "hsla(43,65%,52%,0.2)"
                      }`,
                    }}
                  >
                    {status === "current" ? "AKTUELL" : "VERFÜGBAR"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatesSection;
