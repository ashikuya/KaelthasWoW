import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Sword, Ticket, Star, LogOut, Menu, X,
  Shield, Globe, Clock, Plus, ChevronRight, Check, Loader2,
  Settings, Copy, Database, Coins, Timer, Wifi, WifiOff
} from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Character, SupportTicket, Vote, WOW_CLASSES, WOW_CLASS_COLORS, WOW_RACES_ALLIANCE, WOW_RACES_HORDE } from "@/types/index";
import logoImg from "@/assets/logo.png";

type Tab = "dashboard" | "characters" | "game_chars" | "tickets" | "settings";

// ─── AzerothCore API helper ───────────────────────────────────────────────────
async function callAzerothcoreApi(action: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token ?? "";
  const { data, error } = await supabase.functions.invoke("azerothcore-api", {
    body: { action },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try { msg = await error.context.text(); } catch { /* noop */ }
    }
    throw new Error(msg);
  }
  return data;
}

// WoW class colors by German class name
const GAME_CLASS_COLORS: Record<string, string> = {
  "Krieger": "#C79C6E",
  "Paladin": "#F58CBA",
  "Jäger": "#ABD473",
  "Schurke": "#FFF569",
  "Priester": "#FFFFFF",
  "Todesritter": "#C41F3B",
  "Schamane": "#0070DE",
  "Magier": "#69CCF0",
  "Hexenmeister": "#9482C9",
  "Druide": "#FF7D0A",
};

function formatPlaytime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h`;
  return `${h}h`;
}

function formatGold(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  if (gold > 0) return `${gold.toLocaleString()}g ${silver}s`;
  return `${silver}s`;
}

const UCPLayout = ({ children, tab, setTab, sidebarOpen, setSidebarOpen }: {
  children: React.ReactNode;
  tab: Tab;
  setTab: (t: Tab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    toast.success("Erfolgreich abgemeldet.");
    navigate("/");
  };

  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "game_chars", icon: Database, label: "Game Chars" },
    { id: "characters", icon: Sword, label: "Web Charaktere" },
    { id: "tickets", icon: Ticket, label: "Support" },
    { id: "settings", icon: Settings, label: "Einstellungen" },
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col h-full ${mobile ? "p-4" : "p-6"}`}
      style={{ background: "hsl(220,42%,6%)", borderRight: "1px solid hsl(220,30%,13%)" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-[hsl(43,65%,52%)]/40">
          <img src={logoImg} alt="Kaelthas" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-cinzel font-bold text-base leading-none" style={{ color: "hsl(43,65%,52%)" }}>KAELTHAS</div>
          <div className="font-cinzel text-xs" style={{ color: "hsl(200,85%,55%)" }}>UCP</div>
        </div>
      </Link>

      {/* User info */}
      <div className="mb-6 p-3 rounded-lg" style={{ background: "hsl(220,42%,9%)", border: "1px solid hsl(220,30%,16%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-cinzel font-bold text-sm" style={{ background: "hsla(43,65%,52%,0.2)", color: "hsl(43,65%,52%)", border: "1px solid hsla(43,65%,52%,0.4)" }}>
            {user?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="overflow-hidden">
            <div className="font-cinzel text-sm font-semibold truncate" style={{ color: "hsl(210,40%,88%)" }}>{user?.username}</div>
            <div className="text-xs truncate" style={{ color: "hsl(215,20%,48%)" }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
            style={{
              background: tab === id ? "hsla(43,65%,52%,0.15)" : "transparent",
              border: tab === id ? "1px solid hsla(43,65%,52%,0.3)" : "1px solid transparent",
              color: tab === id ? "hsl(43,65%,58%)" : "hsl(215,20%,58%)",
            }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-cinzel text-sm">{label}</span>
            {tab === id && <ChevronRight className="w-3 h-3 ml-auto" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mt-4 w-full"
        style={{ color: "hsl(0,60%,55%)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(0,60%,55%,0.1)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
      >
        <LogOut className="w-4 h-4" />
        <span className="font-cinzel text-sm">Abmelden</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(222,47%,4%)" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 h-full">
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 sm:px-6 lg:hidden"
          style={{ background: "hsl(220,42%,6%)/95", borderBottom: "1px solid hsl(220,30%,13%)", backdropFilter: "blur(10px)" }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "hsl(215,20%,60%)" }}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-cinzel font-bold text-base" style={{ color: "hsl(43,65%,52%)" }}>KAELTHAS UCP</span>
          <div className="w-5" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
};

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
const DashboardTab = () => {
  const { user } = useAuth();
  const [voteLoading, setVoteLoading] = useState(false);
  const [lastVote, setLastVote] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from("votes").select("voted_at", { count: "exact" }).eq("user_id", user!.id)
      .order("voted_at", { ascending: false }).limit(1)
      .then(({ data, count }) => {
        if (data && data[0]) setLastVote(data[0].voted_at);
        setTotalVotes(count ?? 0);
      });
  }, [user]);

  const canVote = () => {
    if (!lastVote) return true;
    return new Date().getTime() - new Date(lastVote).getTime() > 12 * 60 * 60 * 1000;
  };

  const handleVote = async () => {
    setVoteLoading(true);
    const { error } = await supabase.from("votes").insert({ user_id: user!.id });
    if (error) { toast.error("Fehler beim Abstimmen."); setVoteLoading(false); return; }
    setLastVote(new Date().toISOString());
    setTotalVotes((v) => v + 1);
    toast.success("Danke für deine Stimme! +100 Vote-Punkte gutgeschrieben.");
    setVoteLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("play.kaelthas-wow.com");
    setCopied(true);
    toast.success("Realmlist kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cinzel font-bold text-2xl mb-1" style={{ color: "hsl(210,40%,92%)" }}>
          Willkommen, <span style={{ color: "hsl(43,65%,58%)" }}>{user?.username}</span>
        </h1>
        <p className="text-sm" style={{ color: "hsl(215,20%,50%)" }}>Dein persönliches Control Panel für Kaelthas WoW.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Globe, label: "Server Status", value: "Online", color: "hsl(120,60%,50%)", bg: "hsla(120,60%,50%,0.1)" },
          { icon: Shield, label: "Client Version", value: "3.3.5a", color: "hsl(43,65%,52%)", bg: "hsla(43,65%,52%,0.1)" },
          { icon: Star, label: "Meine Votes", value: String(totalVotes), color: "hsl(200,85%,55%)", bg: "hsla(200,85%,55%,0.1)" },
          { icon: Clock, label: "XP Rate", value: "x5", color: "hsl(43,65%,52%)", bg: "hsla(43,65%,52%,0.1)" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="glass-card rounded-xl p-4 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="font-cinzel font-bold text-xl" style={{ color }}>{value}</div>
              <div className="font-cinzel text-xs tracking-wider" style={{ color: "hsl(215,20%,48%)" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Realmlist */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-cinzel font-semibold text-base mb-4" style={{ color: "hsl(210,40%,88%)" }}>Serververbindung</h2>
          <div className="space-y-3">
            {[
              { label: "Realmlist", value: "play.kaelthas-wow.com", copyable: true },
              { label: "Version", value: "3.3.5a (12340)" },
              { label: "Core", value: "AzerothCore" },
              { label: "Port", value: "3724" },
            ].map(({ label, value, copyable }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: "hsl(220,30%,14%)" }}>
                <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,48%)" }}>{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono" style={{ color: "hsl(200,85%,65%)" }}>{value}</span>
                  {copyable && (
                    <button onClick={handleCopy} className="p-1 rounded hover:bg-[hsl(220,30%,15%)] transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5" style={{ color: "hsl(120,60%,50%)" }} /> : <Copy className="w-3.5 h-3.5" style={{ color: "hsl(215,20%,48%)" }} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vote */}
        <div className="glass-card rounded-xl p-6 flex flex-col">
          <h2 className="font-cinzel font-semibold text-base mb-2" style={{ color: "hsl(210,40%,88%)" }}>Für den Server voten</h2>
          <p className="text-sm mb-4 flex-1" style={{ color: "hsl(215,20%,50%)", lineHeight: 1.6 }}>
            Alle 12 Stunden kannst du für Kaelthas abstimmen und erhältst <strong style={{ color: "hsl(43,65%,58%)" }}>100 Vote-Punkte</strong> als Belohnung.
          </p>
          {!canVote() && lastVote && (
            <div className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "hsla(200,85%,55%,0.1)", color: "hsl(200,85%,65%)", border: "1px solid hsla(200,85%,55%,0.2)" }}>
              Nächster Vote in: {Math.max(0, Math.ceil(12 - (new Date().getTime() - new Date(lastVote).getTime()) / 3600000))}h
            </div>
          )}
          <button
            onClick={handleVote}
            disabled={voteLoading || !canVote()}
            className="btn-gold py-3 rounded-lg text-sm font-cinzel flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {voteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            {canVote() ? "Jetzt voten (+100 Punkte)" : "Bereits gevoted"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Game Characters Tab (real AzerothCore data) ────────────────────────────
const GameCharsTab = () => {
  const [chars, setChars] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    callAzerothcoreApi("get_characters")
      .then((res) => {
        setChars(res.characters ?? []);
        if (res.accountId) setAccount({ id: res.accountId });
        if (res.message) setError(res.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cinzel font-bold text-2xl" style={{ color: "hsl(210,40%,92%)" }}>Game Charaktere</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215,20%,50%)" }}>Deine echten Charaktere direkt aus der AzerothCore-Datenbank.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(43,65%,52%)" }} />
        </div>
      )}

      {!loading && error && (
        <div className="glass-card rounded-xl p-8 text-center" style={{ borderColor: "hsla(0,60%,55%,0.3)" }}>
          <Database className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(0,60%,55%)" }} />
          <p className="font-cinzel font-semibold mb-1" style={{ color: "hsl(0,60%,65%)" }}>Verbindung fehlgeschlagen</p>
          <p className="text-sm" style={{ color: "hsl(215,20%,48%)" }}>{error}</p>
          <p className="text-xs mt-2" style={{ color: "hsl(215,20%,38%)" }}>Stelle sicher dass deine E-Mail mit dem AzerothCore-Account übereinstimmt und der MySQL-Server erreichbar ist.</p>
        </div>
      )}

      {!loading && !error && account && (
        <div className="glass-card rounded-xl p-4 flex items-center gap-3" style={{ borderColor: "hsla(120,60%,50%,0.3)" }}>
          <div className="w-2 h-2 rounded-full bg-[hsl(120,60%,50%)] animate-pulse" />
          <span className="font-cinzel text-sm" style={{ color: "hsl(120,60%,60%)" }}>AzerothCore Account #{account.id} verbunden</span>
        </div>
      )}

      {!loading && !error && chars.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Sword className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(215,20%,35%)" }} />
          <p className="font-cinzel font-semibold mb-2" style={{ color: "hsl(215,20%,55%)" }}>Keine Charaktere gefunden</p>
          <p className="text-sm" style={{ color: "hsl(215,20%,40%)" }}>Erstelle deinen ersten Helden im Spiel!</p>
        </div>
      )}

      {!loading && chars.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {chars.map((char) => {
            const classColor = GAME_CLASS_COLORS[char.class] ?? "#aaa";
            return (
              <div
                key={char.guid}
                className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200"
                style={{ borderColor: char.online ? "hsla(120,60%,50%,0.35)" : undefined }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cinzel font-bold text-lg" style={{ color: classColor }}>{char.name}</h3>
                    <p className="font-cinzel text-xs tracking-wider mt-0.5" style={{ color: "hsl(215,20%,50%)" }}>{char.race} · {char.class}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className="font-cinzel text-xs px-2.5 py-1 rounded-full"
                      style={{
                        color: char.faction === "alliance" ? "hsl(200,85%,65%)" : "hsl(0,70%,60%)",
                        background: char.faction === "alliance" ? "hsla(200,85%,55%,0.1)" : "hsla(0,70%,55%,0.1)",
                        border: `1px solid ${char.faction === "alliance" ? "hsla(200,85%,55%,0.3)" : "hsla(0,70%,55%,0.3)"}`,
                      }}
                    >
                      {char.faction === "alliance" ? "Allianz" : "Horde"}
                    </span>
                    {char.online && (
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" style={{ color: "hsl(120,60%,55%)" }} />
                        <span className="font-cinzel text-xs" style={{ color: "hsl(120,60%,55%)" }}>Online</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Level bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,48%)" }}>Level</span>
                    <span className="font-cinzel text-sm font-bold" style={{ color: classColor }}>{char.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "hsl(220,30%,14%)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(char.level / 80) * 100}%`, background: classColor }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "hsl(220,42%,8%)" }}>
                    <Coins className="w-3 h-3" style={{ color: "hsl(43,65%,52%)" }} />
                    <span className="font-cinzel text-xs" style={{ color: "hsl(43,65%,58%)" }}>{formatGold(char.money)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "hsl(220,42%,8%)" }}>
                    <Timer className="w-3 h-3" style={{ color: "hsl(200,85%,55%)" }} />
                    <span className="font-cinzel text-xs" style={{ color: "hsl(200,85%,65%)" }}>{formatPlaytime(char.totaltime)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Characters Tab ───────────────────────────────────────────────────────────
const CharactersTab = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", class: "Warrior", race: "Human", faction: "alliance" });

  const fetchCharacters = async () => {
    setLoading(true);
    const { data } = await supabase.from("characters").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setCharacters(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCharacters(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Charaktername erforderlich!"); return; }
    setCreating(true);
    const { error } = await supabase.from("characters").insert({ ...form, user_id: user!.id, level: 1 });
    if (error) { toast.error("Fehler: " + error.message); setCreating(false); return; }
    toast.success(`Charakter "${form.name}" erstellt!`);
    setForm({ name: "", class: "Warrior", race: "Human", faction: "alliance" });
    setShowForm(false);
    fetchCharacters();
    setCreating(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) { toast.error("Fehler beim Löschen."); return; }
    toast.success(`"${name}" gelöscht.`);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const allRaces = [...WOW_RACES_ALLIANCE, ...WOW_RACES_HORDE];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel font-bold text-2xl" style={{ color: "hsl(210,40%,92%)" }}>Meine Charaktere</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215,20%,50%)" }}>{characters.length} Charakter{characters.length !== 1 ? "e" : ""} auf diesem Account</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Neu
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6" style={{ border: "1px solid hsla(43,65%,52%,0.3)" }}>
          <h2 className="font-cinzel font-semibold text-base mb-4" style={{ color: "hsl(43,65%,58%)" }}>Neuen Charakter erstellen</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>NAME</label>
              <input
                type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Charaktername" required maxLength={30}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
              />
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>KLASSE</label>
              <select
                value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
              >
                {WOW_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>RASSE</label>
              <select
                value={form.race} onChange={(e) => setForm({ ...form, race: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
              >
                <optgroup label="Allianz">
                  {WOW_RACES_ALLIANCE.map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Horde">
                  {WOW_RACES_HORDE.map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>FRAKTION</label>
              <div className="flex gap-3">
                {[{ value: "alliance", label: "Allianz", color: "hsl(200,85%,55%)" }, { value: "horde", label: "Horde", color: "hsl(0,70%,55%)" }].map(({ value, label, color }) => (
                  <button
                    key={value} type="button" onClick={() => setForm({ ...form, faction: value })}
                    className="flex-1 py-2.5 rounded-lg text-sm font-cinzel transition-all"
                    style={{
                      background: form.faction === value ? `${color}22` : "hsl(220,42%,8%)",
                      border: `1px solid ${form.faction === value ? color : "hsl(220,30%,18%)"}`,
                      color: form.faction === value ? color : "hsl(215,20%,55%)",
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-frost px-5 py-2 rounded-lg text-sm">Abbrechen</button>
              <button type="submit" disabled={creating} className="btn-gold px-5 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Erstellen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(43,65%,52%)" }} />
        </div>
      ) : characters.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Sword className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(215,20%,35%)" }} />
          <p className="font-cinzel font-semibold mb-2" style={{ color: "hsl(215,20%,55%)" }}>Noch keine Charaktere</p>
          <p className="text-sm" style={{ color: "hsl(215,20%,40%)" }}>Erstelle deinen ersten Helden!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {characters.map((char) => (
            <div key={char.id} className="glass-card rounded-xl p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-lg" style={{ color: WOW_CLASS_COLORS[char.class] ?? "hsl(210,40%,88%)" }}>{char.name}</h3>
                  <p className="font-cinzel text-xs tracking-wider mt-0.5" style={{ color: "hsl(215,20%,50%)" }}>{char.race} · {char.class}</p>
                </div>
                <span
                  className="font-cinzel text-xs px-2.5 py-1 rounded-full"
                  style={{
                    color: char.faction === "alliance" ? "hsl(200,85%,65%)" : "hsl(0,70%,60%)",
                    background: char.faction === "alliance" ? "hsla(200,85%,55%,0.1)" : "hsla(0,70%,55%,0.1)",
                    border: `1px solid ${char.faction === "alliance" ? "hsla(200,85%,55%,0.3)" : "hsla(0,70%,55%,0.3)"}`,
                  }}
                >
                  {char.faction === "alliance" ? "Allianz" : "Horde"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full w-24" style={{ background: "hsl(220,30%,14%)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(char.level / 80) * 100}%`, background: WOW_CLASS_COLORS[char.class] ?? "hsl(43,65%,52%)" }} />
                  </div>
                  <span className="font-cinzel text-xs" style={{ color: "hsl(215,20%,55%)" }}>Level {char.level}</span>
                </div>
                <button
                  onClick={() => handleDelete(char.id, char.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-cinzel px-2 py-1 rounded"
                  style={{ color: "hsl(0,60%,55%)", background: "hsla(0,60%,55%,0.1)" }}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Tickets Tab ──────────────────────────────────────────────────────────────
const TicketsTab = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase.from("support_tickets").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setTickets((data as SupportTicket[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("support_tickets").insert({ ...form, user_id: user!.id });
    if (error) { toast.error("Fehler: " + error.message); setSubmitting(false); return; }
    toast.success("Ticket erstellt! Wir melden uns bald.");
    setForm({ subject: "", message: "" });
    setShowForm(false);
    fetchTickets();
    setSubmitting(false);
  };

  const statusConfig = {
    open: { label: "Offen", color: "hsl(43,65%,58%)", bg: "hsla(43,65%,52%,0.12)", border: "hsla(43,65%,52%,0.3)" },
    in_progress: { label: "In Bearbeitung", color: "hsl(200,85%,65%)", bg: "hsla(200,85%,55%,0.12)", border: "hsla(200,85%,55%,0.3)" },
    closed: { label: "Geschlossen", color: "hsl(215,20%,48%)", bg: "hsla(215,20%,30%,0.12)", border: "hsla(215,20%,30%,0.3)" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel font-bold text-2xl" style={{ color: "hsl(210,40%,92%)" }}>Support Tickets</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215,20%,50%)" }}>Kontaktiere unser Team bei Problemen oder Fragen.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ticket
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6" style={{ border: "1px solid hsla(43,65%,52%,0.3)" }}>
          <h2 className="font-cinzel font-semibold text-base mb-4" style={{ color: "hsl(43,65%,58%)" }}>Neues Ticket erstellen</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>BETREFF</label>
              <input
                type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Kurze Beschreibung des Problems" required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
              />
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>NACHRICHT</label>
              <textarea
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Beschreibe dein Problem so detailliert wie möglich..." required rows={5}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-frost px-5 py-2 rounded-lg text-sm">Abbrechen</button>
              <button type="submit" disabled={submitting} className="btn-gold px-5 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                Senden
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(43,65%,52%)" }} />
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Ticket className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(215,20%,35%)" }} />
          <p className="font-cinzel font-semibold mb-2" style={{ color: "hsl(215,20%,55%)" }}>Keine Tickets</p>
          <p className="text-sm" style={{ color: "hsl(215,20%,40%)" }}>Erstelle ein Ticket wenn du Hilfe benötigst.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const s = statusConfig[ticket.status] ?? statusConfig.open;
            return (
              <div key={ticket.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-cinzel font-semibold text-sm" style={{ color: "hsl(210,40%,88%)" }}>{ticket.subject}</h3>
                  <span className="font-cinzel text-xs px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{s.label}</span>
                </div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "hsl(215,20%,52%)" }}>{ticket.message}</p>
                <p className="text-xs" style={{ color: "hsl(215,20%,38%)" }}>
                  Erstellt: {new Date(ticket.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────
const SettingsTab = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const { data, error } = await supabase.auth.updateUser({ data: { username } });
    if (error) { toast.error("Fehler: " + error.message); setSavingProfile(false); return; }
    if (data.user) login({ id: data.user.id, email: data.user.email!, username, avatar: data.user.user_metadata?.avatar_url });
    toast.success("Profil gespeichert!");
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) { toast.error("Passwörter stimmen nicht überein!"); return; }
    if (newPassword.length < 6) { toast.error("Passwort muss mindestens 6 Zeichen haben."); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast.error("Fehler: " + error.message); setSavingPassword(false); return; }
    toast.success("Passwort geändert!");
    setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    setSavingPassword(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-cinzel font-bold text-2xl" style={{ color: "hsl(210,40%,92%)" }}>Einstellungen</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215,20%,50%)" }}>Verwalte dein Profil und deine Sicherheitseinstellungen.</p>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-cinzel font-semibold text-base mb-4" style={{ color: "hsl(43,65%,58%)" }}>Profil</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>BENUTZERNAME</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
              />
            </div>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>E-MAIL</label>
            <input
              type="email" value={user?.email ?? ""} disabled
              className="w-full px-4 py-2.5 rounded-lg text-sm cursor-not-allowed"
              style={{ background: "hsl(220,42%,7%)", border: "1px solid hsl(220,30%,14%)", color: "hsl(215,20%,45%)" }}
            />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Speichern
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-cinzel font-semibold text-base mb-4" style={{ color: "hsl(200,85%,65%)" }}>Passwort ändern</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: "NEUES PASSWORT", value: newPassword, setter: setNewPassword, placeholder: "Mindestens 6 Zeichen" },
            { label: "PASSWORT BESTÄTIGEN", value: confirmNewPassword, setter: setConfirmNewPassword, placeholder: "Passwort wiederholen" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>{label}</label>
              <input
                type="password" value={value} onChange={(e) => setter(e.target.value)}
                placeholder={placeholder} required
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
              />
            </div>
          ))}
          <button type="submit" disabled={savingPassword} className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Passwort ändern
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main UCP Page ────────────────────────────────────────────────────────────
const UCP = () => {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const content = {
    dashboard: <DashboardTab />,
    game_chars: <GameCharsTab />,
    characters: <CharactersTab />,
    tickets: <TicketsTab />,
    settings: <SettingsTab />,
  };

  return (
    <UCPLayout tab={tab} setTab={setTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {content[tab]}
    </UCPLayout>
  );
};

export default UCP;
