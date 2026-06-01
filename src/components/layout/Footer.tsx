import { Link } from "react-router-dom";
import { MessageCircle, ExternalLink } from "lucide-react";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-[hsl(220,30%,12%)]" style={{ background: "hsl(222,50%,3%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[hsl(43,65%,52%)]/40">
                <img src={logoImg} alt="Kaelthas" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-cinzel font-bold text-lg" style={{ color: "hsl(43,65%,52%)" }}>
                  KAELTHAS
                </div>
                <div className="font-cinzel text-xs tracking-widest" style={{ color: "hsl(200,85%,55%)" }}>
                  WOTLK 3.3.5a
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(215,20%,48%)" }}>
              Ein privater AzerothCore World of Warcraft Server. Kostenlos spielbar. Nicht mit Blizzard Entertainment verbunden.
            </p>
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-cinzel"
              style={{
                background: "hsla(120,60%,48%,0.1)",
                border: "1px solid hsla(120,60%,48%,0.3)",
                color: "hsl(120,60%,55%)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[hsl(120,60%,48%)] animate-pulse" />
              Server Online
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm mb-4 tracking-wider" style={{ color: "hsl(43,65%,52%)" }}>
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "#home" },
                { label: "News", href: "#news" },
                { label: "Features", href: "#features" },
                { label: "Server Raten", href: "#rates" },
                { label: "Verbinden", href: "#connect" },
                { label: "Community", href: "#community" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[hsl(43,65%,52%)]"
                    style={{ color: "hsl(215,20%,50%)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm mb-4 tracking-wider" style={{ color: "hsl(200,85%,55%)" }}>
              Account
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Registrieren", href: "/login" },
                { label: "Anmelden", href: "/login" },
                { label: "User Control Panel", href: "/ucp" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[hsl(200,85%,55%)]"
                    style={{ color: "hsl(215,20%,50%)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-cinzel font-semibold text-sm mb-3 tracking-wider" style={{ color: "hsl(43,65%,52%)" }}>
                Community
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Discord", href: "#" },
                  { label: "Forum", href: "#" },
                  { label: "YouTube", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors flex items-center gap-1.5 hover:text-[hsl(43,65%,52%)]"
                      style={{ color: "hsl(215,20%,50%)" }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Server Info */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm mb-4 tracking-wider" style={{ color: "hsl(200,85%,55%)" }}>
              Server Info
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Version", value: "3.3.5a (12340)" },
                { label: "Core", value: "AzerothCore" },
                { label: "Realmlist", value: "play.kaelthas-wow.com" },
                { label: "Port", value: "3724" },
                { label: "XP Rate", value: "x5" },
                { label: "Drop Rate", value: "x3" },
                { label: "Status", value: "Online ●", color: "hsl(120,60%,50%)" },
              ].map(({ label, value, color }) => (
                <li key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs" style={{ color: "hsl(215,20%,45%)" }}>
                    {label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: color || "hsl(215,20%,65%)" }}>
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>
            © 2026 Kaelthas WoW. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs transition-colors hover:text-[hsl(43,65%,52%)]" style={{ color: "hsl(215,20%,35%)" }}>Impressum</a>
            <a href="#" className="text-xs transition-colors hover:text-[hsl(43,65%,52%)]" style={{ color: "hsl(215,20%,35%)" }}>Datenschutz</a>
            <a href="#" className="text-xs transition-colors hover:text-[hsl(43,65%,52%)]" style={{ color: "hsl(215,20%,35%)" }}>Regeln</a>
          </div>
          <p className="text-xs" style={{ color: "hsl(215,20%,30%)" }}>
            World of Warcraft® ist ein Warenzeichen von Blizzard Entertainment, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
