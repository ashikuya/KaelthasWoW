import { Sword, Users, Shield, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Kaelthas WOTLK Server"
          className="w-full h-full object-cover object-top"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,4%)]/60 via-[hsl(220,50%,4%)]/70 to-[hsl(222,47%,4%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,4%)]/80 via-transparent to-[hsl(222,47%,4%)]/80" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.4}s`,
              background: i % 2 === 0 ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)",
              boxShadow: i % 2 === 0
                ? "0 0 8px hsl(43,65%,52%)"
                : "0 0 8px hsl(200,85%,55%)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(200,85%,55%)]/40 bg-[hsl(200,85%,55%)]/10 mb-8 animate-fade-up">
          <div className="w-2 h-2 rounded-full bg-[hsl(200,85%,55%)] animate-pulse" />
          <span className="font-cinzel text-xs tracking-widest text-[hsl(200,85%,55%)]">
            WRATH OF THE LICH KING · 3.3.5a
          </span>
        </div>

        {/* Server Name */}
        <h1
          className="font-cinzel font-black mb-4 leading-none animate-fade-up animate-delay-100"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            background: "linear-gradient(180deg, hsl(43,75%,72%) 0%, hsl(43,65%,52%) 50%, hsl(40,60%,38%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px hsla(43,65%,52%,0.5))",
          }}
        >
          KAELTHAS
        </h1>

        <div className="divider-gold max-w-xs mx-auto mb-6 animate-fade-up animate-delay-200" />

        <p
          className="font-cinzel text-lg md:text-2xl mb-4 tracking-wider animate-fade-up animate-delay-200"
          style={{ color: "hsl(200,85%,72%)" }}
        >
          Der König ist gefallen. Die Dunkelheit erwartet euch.
        </p>
        <p
          className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-delay-300"
          style={{ color: "hsl(215,20%,60%)" }}
        >
          Erlebe den legendären <strong className="text-[hsl(43,65%,52%)]">AzerothCore</strong> WOTLK Server
          mit perfekten Raten, aktiver Community und liebevoll gepflegtem Gameplay.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up animate-delay-300">
          <a href="#connect" className="btn-gold px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center">
            <Sword className="w-5 h-5" />
            Abenteuer beginnen
          </a>
          <a href="#features" className="btn-frost px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center">
            <Shield className="w-5 h-5" />
            Server entdecken
          </a>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16 animate-fade-up animate-delay-400">
          {[
            { icon: Users, value: "Online", label: "Server Status", color: "hsl(120,60%,50%)" },
            { icon: Shield, value: "3.3.5a", label: "Client Version", color: "hsl(43,65%,52%)" },
            { icon: Sword, value: "x5", label: "XP Rate", color: "hsl(200,85%,55%)" },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center">
              <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
              <div className="font-cinzel font-bold text-lg" style={{ color }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="font-cinzel text-xs tracking-widest" style={{ color: "hsl(215,20%,55%)" }}>
          SCROLL
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: "hsl(43,65%,52%)" }} />
      </a>
    </section>
  );
};

export default HeroSection;
