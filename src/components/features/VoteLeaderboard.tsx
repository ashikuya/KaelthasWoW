import { useEffect, useState } from "react";
import { Trophy, Star, Crown, Medal } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface VoterEntry {
  username: string;
  vote_count: number;
  rank: number;
}

// Static leaderboard data (visible to all)
const STATIC_LEADERBOARD: VoterEntry[] = [
  { rank: 1, username: "FrostKnight", vote_count: 47 },
  { rank: 2, username: "Shadowmeld", vote_count: 43 },
  { rank: 3, username: "IceQueen", vote_count: 38 },
  { rank: 4, username: "HordeLord", vote_count: 31 },
  { rank: 5, username: "DeathBringer", vote_count: 28 },
  { rank: 6, username: "ArcaneWizard", vote_count: 22 },
  { rank: 7, username: "PaladinKing", vote_count: 19 },
  { rank: 8, username: "ShadowRogue", vote_count: 15 },
  { rank: 9, username: "FireMage", vote_count: 12 },
  { rank: 10, username: "NatureDruid", vote_count: 9 },
];

const rankStyles: Record<number, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  1: { color: "hsl(43,65%,52%)", bg: "hsla(43,65%,52%,0.15)", border: "hsla(43,65%,52%,0.4)", icon: Crown },
  2: { color: "hsl(210,15%,70%)", bg: "hsla(210,15%,70%,0.1)", border: "hsla(210,15%,70%,0.3)", icon: Medal },
  3: { color: "hsl(25,70%,52%)", bg: "hsla(25,70%,52%,0.1)", border: "hsla(25,70%,52%,0.3)", icon: Medal },
};

const VoteLeaderboard = () => {
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    supabase.from("votes").select("*", { count: "exact", head: true }).then(({ count }) => {
      setTotalVotes(count ?? 0);
    });
  }, []);

  return (
    <section id="leaderboard" className="py-24" style={{ background: "hsl(220,50%,5%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: Leaderboard */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(43,65%,52%)]/30 bg-[hsl(43,65%,52%)]/8 mb-6">
              <Trophy className="w-3 h-3 text-[hsl(43,65%,52%)]" />
              <span className="font-cinzel text-xs tracking-widest text-[hsl(43,65%,52%)]">
                TOP VOTER
              </span>
            </div>
            <h2
              className="font-cinzel font-bold mb-2"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                background: "linear-gradient(180deg, hsl(210,40%,96%) 0%, hsl(215,20%,70%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Rangliste
            </h2>
            <div className="divider-gold max-w-32 mb-6" />
            <p className="text-sm mb-8" style={{ color: "hsl(215,20%,52%)", lineHeight: 1.6 }}>
              Die fleißigsten Unterstützer dieses Monats. Voted täglich für exklusive Belohnungen!
            </p>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {STATIC_LEADERBOARD.slice(0, 3).map((voter) => {
                const style = rankStyles[voter.rank];
                const Icon = style.icon;
                return (
                  <div
                    key={voter.rank}
                    className={`glass-card rounded-xl p-4 text-center flex flex-col items-center gap-2 ${voter.rank === 1 ? "ring-1 ring-[hsl(43,65%,52%)]/40" : ""}`}
                    style={{ borderColor: style.border }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: style.bg, border: `1px solid ${style.border}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: style.color }} />
                    </div>
                    <div className="font-cinzel font-bold text-xs" style={{ color: style.color }}>
                      #{voter.rank}
                    </div>
                    <div className="font-cinzel text-sm font-semibold truncate w-full text-center" style={{ color: "hsl(210,40%,88%)" }}>
                      {voter.username}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" style={{ color: style.color }} />
                      <span className="font-cinzel text-xs" style={{ color: style.color }}>{voter.vote_count}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ranks 4–10 */}
            <div className="space-y-2">
              {STATIC_LEADERBOARD.slice(3).map((voter) => (
                <div
                  key={voter.rank}
                  className="glass-card rounded-lg px-4 py-3 flex items-center gap-4 hover:scale-[1.01] transition-transform duration-200"
                >
                  <span
                    className="font-cinzel font-bold text-sm w-8 flex-shrink-0"
                    style={{ color: "hsl(215,20%,45%)" }}
                  >
                    #{voter.rank}
                  </span>
                  <div className="flex-1 font-cinzel text-sm" style={{ color: "hsl(210,40%,82%)" }}>
                    {voter.username}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3" style={{ color: "hsl(43,65%,45%)" }} />
                    <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,55%)" }}>
                      {voter.vote_count} Votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Vote CTA Box */}
          <div className="space-y-6">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(135deg, hsla(43,65%,10%,0.6) 0%, hsla(220,50%,6%,0.9) 100%)",
                border: "1px solid hsla(43,65%,52%,0.3)",
                boxShadow: "0 0 40px hsla(43,65%,52%,0.06)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "hsla(43,65%,52%,0.15)", border: "1px solid hsla(43,65%,52%,0.4)" }}
                >
                  <Star className="w-6 h-6" style={{ color: "hsl(43,65%,52%)" }} />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg" style={{ color: "hsl(43,65%,58%)" }}>
                    Jetzt Voten
                  </h3>
                  <p className="font-cinzel text-xs" style={{ color: "hsl(215,20%,48%)" }}>
                    Alle 12 Stunden möglich
                  </p>
                </div>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>
                Unterstütze Kaelthas durch deinen Vote und erhalte sofort{" "}
                <strong style={{ color: "hsl(43,65%,60%)" }}>100 Vote-Punkte</strong>{" "}
                gutgeschrieben. Top-Voter erhalten am Monatsende exklusive Ingame-Belohnungen!
              </p>

              {/* Rewards list */}
              <div className="space-y-2 mb-6">
                {[
                  { label: "Platz 1", reward: "Exklusives Mount + 5.000 Punkte", color: "hsl(43,65%,52%)" },
                  { label: "Platz 2", reward: "Exklusives Title + 2.500 Punkte", color: "hsl(210,15%,70%)" },
                  { label: "Platz 3", reward: "Custom Cosmetics + 1.000 Punkte", color: "hsl(25,70%,52%)" },
                ].map(({ label, reward, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: "hsla(220,50%,7%,0.8)", border: "1px solid hsl(220,30%,14%)" }}
                  >
                    <Trophy className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    <span className="font-cinzel text-xs font-semibold" style={{ color }}>{label}:</span>
                    <span className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>{reward}</span>
                  </div>
                ))}
              </div>

              <a
                href="/ucp"
                className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 font-cinzel"
              >
                <Star className="w-4 h-4" />
                Im UCP abstimmen
              </a>
            </div>

            {/* Total vote counter */}
            <div
              className="glass-card rounded-xl p-6 text-center"
              style={{ borderColor: "hsla(200,85%,55%,0.3)" }}
            >
              <div
                className="font-cinzel font-black mb-1"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  background: "linear-gradient(180deg, hsl(200,85%,65%) 0%, hsl(200,70%,45%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px hsla(200,85%,55%,0.4))",
                }}
              >
                {totalVotes > 0 ? totalVotes.toLocaleString() : "1.240"}
              </div>
              <div className="font-cinzel text-sm tracking-widest" style={{ color: "hsl(215,20%,55%)" }}>
                GESAMTE VOTES
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoteLeaderboard;
