import { Download, Settings, Wifi, Sword, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Client herunterladen",
    description: "Lade den offiziellen WoW 3.3.5a Client herunter oder nutze deinen vorhandenen Client.",
    action: { label: "Download Link", href: "#" },
    color: "gold",
  },
  {
    number: "02",
    icon: Settings,
    title: "Realmlist ändern",
    description: 'Öffne die Datei "realmlist.wtf" im WoW Ordner und ersetze den Inhalt mit unserer Serveradresse.',
    action: null,
    color: "frost",
    realmlist: "set realmlist play.kaelthas-wow.com",
  },
  {
    number: "03",
    icon: Wifi,
    title: "Account erstellen",
    description: "Registriere dich auf unserer Webseite und erstelle deinen Spieleraccount in wenigen Sekunden.",
    action: { label: "Registrieren", href: "/login" },
    color: "gold",
  },
  {
    number: "04",
    icon: Sword,
    title: "Ins Abenteuer stürzen",
    description: "Starte WoW, melde dich mit deinem Account an und wähle deinen Charakter. Das Abenteuer beginnt!",
    action: null,
    color: "frost",
  },
];

const HowToPlay = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("In Zwischenablage kopiert!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="connect" className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-6">
            <Wifi className="w-3 h-3 text-[hsl(43,65%,52%)]" />
            <span className="font-cinzel text-xs tracking-widest text-[hsl(43,65%,52%)]">
              VERBINDUNG & START
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
            So trittst du bei
          </h2>
          <div className="divider-gold max-w-48 mx-auto mb-4" />
          <p className="max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)", lineHeight: 1.7 }}>
            In nur 4 Schritten zum Spielen. Einfach, schnell, kostenlos.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map(({ number, icon: Icon, title, description, action, color, realmlist }, idx) => (
            <div key={number} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                  style={{
                    background: "linear-gradient(90deg, hsl(43,65%,52%), transparent)",
                    transform: "translateX(-10px)",
                    width: "calc(100% - 20px)",
                  }}
                />
              )}

              <div className="glass-card rounded-xl p-6 flex flex-col gap-4 h-full relative z-10 hover:scale-105 transition-transform duration-300">
                {/* Step Number */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        color === "gold"
                          ? "hsla(43,65%,52%,0.12)"
                          : "hsla(200,85%,55%,0.12)",
                      border: `1px solid ${
                        color === "gold"
                          ? "hsla(43,65%,52%,0.35)"
                          : "hsla(200,85%,55%,0.35)"
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
                  <span
                    className="font-cinzel font-black text-4xl opacity-20"
                    style={{ color: color === "gold" ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }}
                  >
                    {number}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-cinzel font-semibold text-base mb-2" style={{ color: "hsl(210,40%,90%)" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,52%)" }}>
                    {description}
                  </p>
                </div>

                {/* Realmlist copy */}
                {realmlist && (
                  <div
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded font-mono text-xs"
                    style={{
                      background: "hsl(220,50%,7%)",
                      border: "1px solid hsl(220,30%,18%)",
                      color: "hsl(200,85%,65%)",
                    }}
                  >
                    <span className="truncate">{realmlist}</span>
                    <button
                      onClick={() => handleCopy(realmlist)}
                      className="flex-shrink-0 p-1 rounded hover:bg-[hsl(220,30%,15%)] transition-colors"
                      aria-label="Kopieren"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5" style={{ color: "hsl(120,60%,50%)" }} />
                      ) : (
                        <Copy className="w-3.5 h-3.5" style={{ color: "hsl(215,20%,55%)" }} />
                      )}
                    </button>
                  </div>
                )}

                {/* Action button */}
                {action && (
                  <Link
                    to={action.href}
                    className={`text-center py-2 px-4 rounded text-sm font-cinzel font-semibold tracking-wider transition-all duration-300 ${
                      color === "gold" ? "btn-gold" : "btn-frost"
                    }`}
                  >
                    {action.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Server Info Box */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, hsla(200,60%,7%,0.9) 0%, hsla(220,50%,6%,0.9) 100%)",
            border: "1px solid hsla(200,85%,55%,0.25)",
            boxShadow: "0 0 40px hsla(200,85%,55%,0.08)",
          }}
        >
          <h3 className="font-cinzel font-bold text-2xl mb-2" style={{ color: "hsl(200,85%,70%)" }}>
            Serveradresse
          </h3>
          <div className="divider-frost max-w-32 mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div
              className="px-6 py-3 rounded-lg font-mono text-lg font-semibold"
              style={{
                background: "hsl(220,50%,7%)",
                border: "1px solid hsla(200,85%,55%,0.3)",
                color: "hsl(200,85%,65%)",
              }}
            >
              play.kaelthas-wow.com
            </div>
            <div
              className="px-4 py-3 rounded-lg font-cinzel text-sm"
              style={{
                background: "hsla(43,65%,52%,0.1)",
                border: "1px solid hsla(43,65%,52%,0.3)",
                color: "hsl(43,65%,60%)",
              }}
            >
              Port: 3724 (Standard)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToPlay;
