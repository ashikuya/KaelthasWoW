import { Users, Globe, Star, Clock } from "lucide-react";
import { useOnlineCount } from "@/hooks/useOnlineCount";

const ServerStats = () => {
  const { count, loading } = useOnlineCount(60_000);

  const stats = [
    {
      icon: Users,
      value: loading ? "..." : String(count ?? 0),
      label: "Spieler Online",
      color: "frost",
      pulse: true,
    },
    {
      icon: Globe,
      value: "99.9%",
      label: "Uptime",
      color: "gold",
      pulse: false,
    },
    {
      icon: Star,
      value: "4.8/5",
      label: "Community Rating",
      color: "gold",
      pulse: false,
    },
    {
      icon: Clock,
      value: "365",
      label: "Tage Online",
      color: "frost",
      pulse: false,
    },
  ];

  return (
    <section id="stats" className="py-14 relative overflow-hidden" style={{ background: "hsl(220,50%,5%)" }}>
      {/* Top / bottom dividers */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(200,85%,55%), hsl(43,65%,52%), hsl(200,85%,55%), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(43,65%,52%), hsl(200,85%,55%), hsl(43,65%,52%), transparent)" }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, hsla(200,85%,30%,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, value, label, color, pulse }, i) => (
            <div
              key={label}
              className="stat-card group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* BG glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                style={{
                  background: color === "gold"
                    ? "radial-gradient(ellipse at center, hsla(43,65%,52%,0.06) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at center, hsla(200,85%,55%,0.06) 0%, transparent 70%)",
                }}
              />

              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                style={{
                  background: color === "gold"
                    ? "linear-gradient(90deg, transparent, hsl(43,65%,52%), transparent)"
                    : "linear-gradient(90deg, transparent, hsl(200,85%,55%), transparent)",
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${pulse ? "animate-pulse-frost" : ""}`}
                  style={{
                    background: color === "gold" ? "hsla(43,65%,52%,0.12)" : "hsla(200,85%,55%,0.12)",
                    border: `1px solid ${color === "gold" ? "hsla(43,65%,52%,0.35)" : "hsla(200,85%,55%,0.35)"}`,
                    boxShadow: color === "gold" ? "0 0 20px hsla(43,65%,52%,0.15)" : "0 0 20px hsla(200,85%,55%,0.15)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }} />
                </div>
                <div
                  className="font-cinzel font-black text-3xl mb-1 counter-value"
                  style={{ color: color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }}
                >
                  {value}
                </div>
                <div className="font-cinzel text-xs tracking-wider uppercase" style={{ color: "hsl(215,20%,52%)" }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServerStats;
