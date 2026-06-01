import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sword, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const slides = [
  {
    id: 1,
    bg: heroBg,
    badge: "WRATH OF THE LICH KING · 3.3.5a",
    title: "KAELTHAS",
    subtitle: "Der König ist gefallen. Die Dunkelheit erwartet euch.",
    description: "Erlebe das legendäre WOTLK Erlebnis mit AzerothCore – kostenlos, stabil und liebevoll gepflegt.",
    cta1: { label: "Jetzt beitreten", href: "/login", icon: Sword },
    cta2: { label: "Mehr erfahren", href: "#features", icon: Shield },
    accent: "gold",
  },
  {
    id: 2,
    bg: heroBg,
    badge: "ICECROWN CITADEL · PHASE 2 LIVE",
    title: "ICECROWN",
    subtitle: "Die Eiskronenzitadelle öffnet ihre Tore.",
    description: "Alle 12 Bosse verfügbar. Heroic Mode freigeschaltet. Bist du bereit, dem Lichkönig entgegenzutreten?",
    cta1: { label: "Charakter erstellen", href: "/login", icon: Sword },
    cta2: { label: "Raten ansehen", href: "#rates", icon: Shield },
    accent: "frost",
  },
  {
    id: 3,
    bg: heroBg,
    badge: "COMMUNITY · EVENTS · PVPB",
    title: "COMMUNITY",
    subtitle: "Schreibe deine eigene Legende.",
    description: "Trete Gilden bei, kämpfe in Arenen und erlebe wöchentliche Events mit exklusiven Belohnungen.",
    cta1: { label: "Registrieren", href: "/login", icon: Sword },
    cta2: { label: "Community", href: "#community", icon: Shield },
    accent: "gold",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [current]);

  const slide = slides[current];
  const isGold = slide.accent === "gold";

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.bg}
          alt="Kaelthas WOTLK"
          className="w-full h-full object-cover object-top transition-opacity duration-500"
          style={{ opacity: transitioning ? 0 : 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,4%)]/60 via-[hsl(220,50%,4%)]/70 to-[hsl(222,47%,4%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,4%)]/80 via-transparent to-[hsl(222,47%,4%)]/80" />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              background: i % 2 === 0 ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)",
              boxShadow: i % 2 === 0 ? "0 0 8px hsl(43,65%,52%)" : "0 0 8px hsl(200,85%,55%)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
          style={{
            borderColor: isGold ? "hsla(43,65%,52%,0.4)" : "hsla(200,85%,55%,0.4)",
            background: isGold ? "hsla(43,65%,52%,0.1)" : "hsla(200,85%,55%,0.1)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: isGold ? "hsl(43,65%,52%)" : "hsl(200,85%,55%)" }}
          />
          <span
            className="font-cinzel text-xs tracking-widest"
            style={{ color: isGold ? "hsl(43,65%,60%)" : "hsl(200,85%,60%)" }}
          >
            {slide.badge}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-cinzel font-black mb-4 leading-none"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            background: isGold
              ? "linear-gradient(180deg, hsl(43,75%,72%) 0%, hsl(43,65%,52%) 50%, hsl(40,60%,38%) 100%)"
              : "linear-gradient(180deg, hsl(200,90%,85%) 0%, hsl(200,85%,55%) 50%, hsl(205,80%,38%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: isGold
              ? "drop-shadow(0 0 30px hsla(43,65%,52%,0.5))"
              : "drop-shadow(0 0 30px hsla(200,85%,55%,0.5))",
          }}
        >
          {slide.title}
        </h1>

        <div className={isGold ? "divider-gold max-w-xs mx-auto mb-6" : "divider-frost max-w-xs mx-auto mb-6"} />

        <p className="font-cinzel text-lg md:text-2xl mb-4 tracking-wider" style={{ color: isGold ? "hsl(43,65%,68%)" : "hsl(200,85%,72%)" }}>
          {slide.subtitle}
        </p>
        <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(215,20%,60%)" }}>
          {slide.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to={slide.cta1.href} className="btn-gold px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center">
            <slide.cta1.icon className="w-5 h-5" />
            {slide.cta1.label}
          </Link>
          <a href={slide.cta2.href} className="btn-frost px-8 py-3.5 rounded text-base flex items-center gap-2 w-full sm:w-auto justify-center">
            <slide.cta2.icon className="w-5 h-5" />
            {slide.cta2.label}
          </a>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: "hsla(220,42%,8%,0.8)", border: "1px solid hsl(220,30%,20%)", color: "hsl(215,20%,60%)" }}
        aria-label="Vorheriger Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: "hsla(220,42%,8%,0.8)", border: "1px solid hsl(220,30%,20%)", color: "hsl(215,20%,60%)" }}
        aria-label="Nächster Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? "hsl(43,65%,52%)" : "hsl(220,30%,22%)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
