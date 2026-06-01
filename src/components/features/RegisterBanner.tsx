import { Link } from "react-router-dom";
import { Sword, UserPlus, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const RegisterBanner = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="py-16" style={{ background: "hsl(220,50%,5%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg, hsla(220,50%,7%,0.95) 0%, hsla(210,60%,9%,0.95) 100%)",
            border: "1px solid hsla(43,65%,52%,0.3)",
            boxShadow: "0 0 60px hsla(43,65%,52%,0.08), inset 0 0 60px hsla(200,85%,55%,0.03)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsla(43,65%,52%,0.08) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsla(200,85%,55%,0.08) 0%, transparent 70%)",
              transform: "translate(50%, 50%)",
            }}
          />

          <div className="relative z-10 text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-cinzel tracking-widest"
              style={{
                background: "hsla(43,65%,52%,0.12)",
                border: "1px solid hsla(43,65%,52%,0.3)",
                color: "hsl(43,65%,60%)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(43,65%,52%)] animate-pulse" />
              KOSTENLOS SPIELEN
            </div>
            <h2
              className="font-cinzel font-black text-3xl md:text-4xl mb-3"
              style={{
                background: "linear-gradient(135deg, hsl(43,75%,72%) 0%, hsl(43,65%,52%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dein Abenteuer wartet
            </h2>
            <p className="text-base max-w-lg" style={{ color: "hsl(215,20%,58%)", lineHeight: 1.7 }}>
              Registriere dich jetzt kostenlos und tauche ein in das legendäre{" "}
              <strong style={{ color: "hsl(200,85%,65%)" }}>Wrath of the Lich King</strong> Erlebnis.
              Kein Download außer dem WoW 3.3.5a Client notwendig.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link
              to="/login"
              className="btn-gold px-8 py-4 rounded-xl text-base flex items-center gap-2 justify-center whitespace-nowrap"
              style={{ minWidth: 200 }}
            >
              <UserPlus className="w-5 h-5" />
              Jetzt registrieren
            </Link>
            <a
              href="#connect"
              className="btn-frost px-8 py-4 rounded-xl text-base flex items-center gap-2 justify-center whitespace-nowrap"
            >
              <Sword className="w-5 h-5" />
              Verbindungsguide
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterBanner;
