import logoImg from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-[hsl(220,30%,12%)]" style={{ background: "hsl(222,50%,3%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
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
            <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,48%)" }}>
              Ein privater AzerothCore World of Warcraft Server. Wir sind nicht mit Blizzard Entertainment verbunden.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-cinzel font-semibold text-sm mb-4 tracking-wider" style={{ color: "hsl(43,65%,52%)" }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {["Home", "Features", "Raten", "Verbinden", "Community"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm transition-colors duration-200 hover:text-[hsl(43,65%,52%)]"
                    style={{ color: "hsl(215,20%,50%)" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
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

        {/* Bottom */}
        <div className="divider-gold" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>
            © 2024 Kaelthas WoW. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs" style={{ color: "hsl(215,20%,35%)" }}>
            World of Warcraft ist ein eingetragenes Warenzeichen von Blizzard Entertainment, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
