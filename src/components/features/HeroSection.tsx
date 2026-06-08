import { Sword, Users, Shield, ChevronDown, Snowflake } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

// Snowflake / ice crystal particle
const IceParticle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute pointer-events-none" style={style}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="6" x2="10" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="6" x2="14" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="10" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="14" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="12" x2="4" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="12" x2="4" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="12" x2="20" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="12" x2="20" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  const particles = [
    { left: "8%",  top: "15%", size: 18, delay: 0,   dur: 7,   opacity: 0.35, color: "hsl(200,85%,65%)" },
    { left: "22%", top: "60%", size: 10, delay: 1.2, dur: 9,   opacity: 0.25, color: "hsl(43,65%,52%)" },
    { left: "38%", top: "25%", size: 14, delay: 0.5, dur: 8,   opacity: 0.3,  color: "hsl(200,85%,65%)" },
    { left: "55%", top: "70%", size: 8,  delay: 2,   dur: 6,   opacity: 0.2,  color: "hsl(43,65%,52%)" },
    { left: "70%", top: "20%", size: 20, delay: 0.8, dur: 10,  opacity: 0.35, color: "hsl(200,85%,65%)" },
    { left: "82%", top: "55%", size: 12, delay: 1.5, dur: 7.5, opacity: 0.28, color: "hsl(43,75%,65%)" },
    { left: "92%", top: "35%", size: 9,  delay: 3,   dur: 8.5, opacity: 0.22, color: "hsl(200,85%,65%)" },
    { left: "15%", top: "80%", size: 16, delay: 1.8, dur: 9.5, opacity: 0.3,  color: "hsl(200,90%,72%)" },
    { left: "48%", top: "45%", size: 6,  delay: 0.3, dur: 6.5, opacity: 0.18, color: "hsl(43,65%,52%)" },
    { left: "64%", top: "88%", size: 11, delay: 2.5, dur: 8,   opacity: 0.25, color: "hsl(200,85%,65%)" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero BG */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Kaelthas WOTLK Server"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,4%)]/55 via-[hsl(220,50%,4%)]/65 to-[hsl(222,47%,4%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,4%)]/75 via-transparent to-[hsl(222,47%,4%)]/75" />
      </div>

      {/* Animated aurora orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Rotating frost rings */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="frost-ring frost-ring-1" />
        <div className="frost-ring frost-ring-2" />
        <div className="frost-ring frost-ring-3" />
      </div>

      {/* Ice crystal particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <IceParticle
            key={i}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              color: p.color,
              opacity: p.opacity,
              animation: `snowDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
              filter: `drop-shadow(0 0 4px ${p.color})`,
            }}
          />
        ))}
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 z-0 pointer-events-none scan-line" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(200,85%,55%)]/40 bg-[hsl(200,85%,55%)]/10 mb-8 animate-fade-up backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[hsl(200,85%,55%)] animate-pulse" />
          <span className="font-cinzel text-xs tracking-widest text-[hsl(200,85%,55%)]">
            WRATH OF THE LICH KING · 3.3.5a
          </span>
        </div>

        {/* Server Name with shimmer */}
        <div className="relative inline-block mb-4 animate-fade-up animate-delay-100">
          <h1
            className="font-cinzel font-black leading-none hero-title-shimmer"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          >
            KAELTHAS
          </h1>
        </div>

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
          <Link
            to="/login"
            className="btn-gold px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center relative overflow-hidden btn-shimmer"
          >
            <Sword className="w-5 h-5" />
            Abenteuer beginnen
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("connect");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else navigate("/#connect");
            }}
            className="btn-frost px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Shield className="w-5 h-5" />
            Jetzt Spielen
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16 animate-fade-up animate-delay-400">
          {[
            { icon: Users, value: "Online", label: "Server Status", color: "hsl(120,60%,50%)" },
            { icon: Shield, value: "3.3.5a", label: "Client Version", color: "hsl(43,65%,52%)" },
            { icon: Sword, value: "x5", label: "XP Rate", color: "hsl(200,85%,55%)" },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${color}18`, border: `1px solid ${color}44` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
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
