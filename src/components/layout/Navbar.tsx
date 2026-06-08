import { useState, useEffect } from "react";
import { Menu, X, Sword, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", hash: "home" },
  { label: "News", hash: "news" },
  { label: "Features", hash: "features" },
  { label: "Raten", hash: "rates" },
  { label: "Voten", hash: "leaderboard" },
  { label: "Verbinden", hash: "connect" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count: onlinePlayers, loading: countLoading } = useOnlineCount(60_000);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (hash: string) => isHome ? `#${hash}` : `/#${hash}`;

  const handleNavClick = (e: React.MouseEvent, hash: string) => {
    if (!isHome) {
      e.preventDefault();
      navigate(`/#${hash}`);
    }
    setMenuOpen(false);
  };

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
          <a
            href={getHref("home")}
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
              <img
                src={logoImg}
                alt="Kaelthas"
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 0 10px hsla(200,85%,55%,0.6))" }}
              />
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
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={getHref(link.hash)}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="font-cinzel text-sm tracking-wider transition-all duration-300 cursor-pointer"
                style={{ color: "hsl(215,20%,65%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(43,65%,52%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(215,20%,65%)"; }}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/forum"
              className="font-cinzel text-sm tracking-wider transition-all duration-300"
              style={{ color: "hsl(200,85%,65%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(43,65%,52%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(200,85%,65%)"; }}
            >
              Forum
            </Link>
          </div>

          {/* CTA / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
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
                <a
                  href={getHref("connect")}
                  onClick={(e) => handleNavClick(e, "connect")}
                  className="btn-gold px-5 py-2 rounded text-sm flex items-center gap-2"
                >
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
                  href={getHref(link.hash)}
                  onClick={(e) => handleNavClick(e, link.hash)}
                  className="block px-4 py-3 font-cinzel text-sm tracking-wider text-[hsl(215,20%,65%)] hover:text-[hsl(43,65%,52%)] hover:bg-[hsl(220,30%,8%)] rounded transition-all"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/forum"
                className="block px-4 py-3 font-cinzel text-sm tracking-wider hover:bg-[hsl(220,30%,8%)] rounded transition-all"
                style={{ color: "hsl(200,85%,65%)" }}
                onClick={() => setMenuOpen(false)}
              >
                Forum
              </Link>
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
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-5 py-2.5 rounded text-sm font-cinzel"
                      style={{ color: "hsl(0,60%,55%)", border: "1px solid hsla(0,60%,55%,0.3)" }}
                    >
                      Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="btn-frost w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Login / Registrieren
                    </Link>
                    <a
                      href={getHref("connect")}
                      onClick={(e) => handleNavClick(e, "connect")}
                      className="btn-gold w-full text-center px-5 py-2.5 rounded text-sm flex items-center justify-center gap-2"
                    >
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
