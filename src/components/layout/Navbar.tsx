import { useState, useEffect } from "react";
import { Menu, X, Sword, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "News", href: "#news" },
  { label: "Features", href: "#features" },
  { label: "Gallery", href: "#gallery" },
  { label: "Raten", href: "#rates" },
  { label: "Voten", href: "#leaderboard" },
  { label: "Verbinden", href: "#connect" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count: onlinePlayers, loading: countLoading } = useOnlineCount(60_000);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    setUserMenuOpen(false);
    toast.success("Erfolgreich abgemeldet.");
    navigate("/");
  };

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

          {/* Online Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "hsla(120,60%,50%,0.1)", border: "1px solid hsla(120,60%,50%,0.25)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(120,60%,50%)] animate-pulse" />
            <span className="font-cinzel text-xs" style={{ color: "hsl(120,60%,55%)" }}>
              {countLoading ? "..." : `${onlinePlayers ?? 0} Online`}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-cinzel text-sm tracking-wider transition-all duration-300"
                style={{ color: "hsl(215,20%,65%)" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "hsl(43,65%,52%)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "hsl(215,20%,65%)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group"
                  style={{
                    background: "hsla(43,65%,52%,0.1)",
                    border: "1px solid hsla(43,65%,52%,0.3)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsla(43,65%,52%,0.6)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsla(43,65%,52%,0.3)"; }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-cinzel font-bold text-xs"
                    style={{ background: "hsla(43,65%,52%,0.25)", color: "hsl(43,65%,58%)" }}
                  >
                    {user.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="font-cinzel text-sm" style={{ color: "hsl(43,65%,58%)" }}>
                    {user.username}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "hsl(220,42%,7%)",
                      border: "1px solid hsl(220,30%,16%)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                    }}
                  >
                    <Link
                      to="/ucp"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors text-sm font-cinzel"
                      style={{ color: "hsl(215,20%,65%)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220,42%,11%)"; (e.currentTarget as HTMLElement).style.color = "hsl(43,65%,58%)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "hsl(215,20%,65%)"; }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      UCP
                    </Link>
                    <div style={{ height: "1px", background: "hsl(220,30%,14%)" }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm font-cinzel text-left"
                      style={{ color: "hsl(0,60%,55%)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsla(0,60%,55%,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <LogOut className="w-4 h-4" />
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-frost px-4 py-2 rounded text-sm flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <a href="#connect" className="btn-gold px-5 py-2 rounded text-sm flex items-center gap-2">
                  <Sword className="w-4 h-4" />
                  Jetzt Spielen
                </a>
              </>
            )}
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
              <div className="px-4 pt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/ucp"
                      className="btn-frost w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      UCP öffnen
                    </Link>
                    <button onClick={handleLogout} className="w-full text-center px-5 py-2.5 rounded text-sm font-cinzel" style={{ color: "hsl(0,60%,55%)", border: "1px solid hsla(0,60%,55%,0.3)" }}>
                      Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-frost w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Login / Registrieren
                    </Link>
                    <a href="#connect" className="btn-gold w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2">
                      <Sword className="w-4 h-4" />
                      Jetzt Spielen
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
