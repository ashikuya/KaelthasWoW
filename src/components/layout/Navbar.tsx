import { useState, useEffect } from "react";
import { Menu, X, Sword } from "lucide-react";
import logoImg from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Raten", href: "#rates" },
  { label: "Verbinden", href: "#connect" },
  { label: "Community", href: "#community" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[hsl(222,47%,4%)]/95 backdrop-blur-md border-b border-[hsl(220,30%,15%)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[hsl(43,65%,52%)]/40 group-hover:border-[hsl(43,65%,52%)] transition-all duration-300">
              <img src={logoImg} alt="Kaelthas" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-bold text-lg leading-none text-glow-gold" style={{ color: "hsl(43,65%,52%)" }}>
                KAELTHAS
              </span>
              <span className="text-xs font-cinzel tracking-widest" style={{ color: "hsl(200,85%,55%)" }}>
                WOTLK 3.3.5a
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-cinzel text-sm tracking-wider transition-all duration-300 hover:text-glow-gold"
                style={{ color: "hsl(215,20%,65%)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "hsl(43,65%,52%)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "hsl(215,20%,65%)";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#connect"
              className="btn-gold px-5 py-2 rounded text-sm flex items-center gap-2"
            >
              <Sword className="w-4 h-4" />
              Jetzt Spielen
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded border border-[hsl(220,30%,20%)] text-[hsl(215,20%,65%)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu öffnen"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[hsl(220,30%,15%)] bg-[hsl(222,47%,4%)]/98 backdrop-blur-md">
            <div className="py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 font-cinzel text-sm tracking-wider text-[hsl(215,20%,65%)] hover:text-[hsl(43,65%,52%)] hover:bg-[hsl(220,30%,8%)] rounded transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-2">
                <a href="#connect" className="btn-gold w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2">
                  <Sword className="w-4 h-4" />
                  Jetzt Spielen
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
