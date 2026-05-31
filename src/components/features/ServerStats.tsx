import { Users, Globe, Star, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "247",
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

const ServerStats = () => {
  return (
    <section id="stats" className="py-12 border-y border-[hsl(220,30%,12%)]" style={{ background: "hsl(220,50%,5%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, color, pulse }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-lg glass-card group hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  pulse ? "animate-pulse-frost" : ""
                }`}
                style={{
                  background:
                    color === "gold"
                      ? "hsla(43,65%,52%,0.15)"
                      : "hsla(200,85%,55%,0.15)",
                  border: `1px solid ${
                    color === "gold"
                      ? "hsla(43,65%,52%,0.4)"
                      : "hsla(200,85%,55%,0.4)"
                  }`,
                }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{
                    color:
                      color === "gold"
                        ? "hsl(43,65%,52%)"
                        : "hsl(200,85%,55%)",
                  }}
                />
              </div>
              <div
                className="font-cinzel font-bold text-3xl mb-1"
                style={{
                  color:
                    color === "gold"
                      ? "hsl(43,65%,52%)"
                      : "hsl(200,85%,55%)",
                }}
              >
                {value}
              </div>
              <div
                className="font-cinzel text-xs tracking-wider uppercase"
                style={{ color: "hsl(215,20%,55%)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServerStats;
