import { MessageCircle, Youtube, Twitter, Globe } from "lucide-react";

const socials = [
  {
    icon: MessageCircle,
    name: "Discord",
    description: "Tritt unserem Discord bei und triff die Community",
    members: "2.400+ Mitglieder",
    href: "#",
    color: "hsl(235,85%,65%)",
    bg: "hsla(235,85%,65%,0.1)",
    border: "hsla(235,85%,65%,0.3)",
  },
  {
    icon: Globe,
    name: "Forum",
    description: "Diskutiere Strategien, Guides und Server-News",
    members: "Aktives Forum",
    href: "#",
    color: "hsl(43,65%,52%)",
    bg: "hsla(43,65%,52%,0.1)",
    border: "hsla(43,65%,52%,0.3)",
  },
  {
    icon: Youtube,
    name: "YouTube",
    description: "Guides, Raids und Highlights auf unserem Kanal",
    members: "Video Content",
    href: "#",
    color: "hsl(0,85%,55%)",
    bg: "hsla(0,85%,55%,0.1)",
    border: "hsla(0,85%,55%,0.3)",
  },
  {
    icon: Twitter,
    name: "Twitter / X",
    description: "Aktuelle News, Updates und Ankündigungen",
    members: "Neuigkeiten",
    href: "#",
    color: "hsl(200,85%,55%)",
    bg: "hsla(200,85%,55%,0.1)",
    border: "hsla(200,85%,55%,0.3)",
  },
];

const CommunitySection = () => {
  return (
    <section id="community" className="py-24" style={{ background: "hsl(220,50%,5%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(200,85%,55%)]/30 bg-[hsl(200,85%,55%)]/8 mb-6">
            <MessageCircle className="w-3 h-3 text-[hsl(200,85%,55%)]" />
            <span className="font-cinzel text-xs tracking-widest text-[hsl(200,85%,55%)]">
              COMMUNITY
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
            Werde Teil der Community
          </h2>
          <div className="divider-frost max-w-48 mx-auto mb-4" />
          <p className="max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)", lineHeight: 1.7 }}>
            Schließe dich tausenden von Spielern an, tausche Strategien aus und erlebe gemeinsam das WOTLK-Abenteuer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socials.map(({ icon: Icon, name, description, members, href, color, bg, border }) => (
            <a
              key={name}
              href={href}
              className="glass-card rounded-xl p-6 flex flex-col gap-4 group hover:scale-105 transition-all duration-300 hover:no-underline"
              style={{ borderColor: border }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-cinzel font-semibold text-base mb-1.5" style={{ color: "hsl(210,40%,90%)" }}>
                  {name}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "hsl(215,20%,52%)" }}>
                  {description}
                </p>
                <span
                  className="text-xs font-cinzel tracking-wider px-2.5 py-1 rounded-full"
                  style={{ color, background: bg, border: `1px solid ${border}` }}
                >
                  {members}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
