import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sword, Mail, Lock, User, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth, mapSupabaseUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

type Mode = "login" | "register" | "otp";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Login fehlgeschlagen: " + error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      login(mapSupabaseUser(data.user));
      toast.success("Willkommen zurück, Held!");
      navigate("/ucp");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwörter stimmen nicht überein!");
      return;
    }
    if (password.length < 6) {
      toast.error("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      toast.error("OTP Fehler: " + error.message);
      setLoading(false);
      return;
    }
    toast.success("OTP wurde an deine E-Mail gesendet!");
    setMode("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) {
      toast.error("Ungültiger Code: " + error.message);
      setLoading(false);
      return;
    }
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password,
      data: { username: username || email.split("@")[0] },
    });
    if (updateError) {
      toast.error("Fehler: " + updateError.message);
      setLoading(false);
      return;
    }
    if (updateData.user) {
      login(mapSupabaseUser(updateData.user));
      toast.success("Account erstellt! Willkommen in Kaelthas!");
      navigate("/ucp");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(222,47%,4%)" }}>
      {/* Left: Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={heroBg} alt="Kaelthas" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[hsl(222,47%,4%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,4%)]/60 via-transparent to-[hsl(222,47%,4%)]/40" />
        <div className="absolute bottom-12 left-10 right-10">
          <h2
            className="font-cinzel font-black text-4xl mb-3"
            style={{
              background: "linear-gradient(180deg, hsl(43,75%,72%) 0%, hsl(43,65%,52%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px hsla(43,65%,52%,0.5))",
            }}
          >
            KAELTHAS
          </h2>
          <p className="font-cinzel text-sm tracking-widest" style={{ color: "hsl(200,85%,65%)" }}>
            WRATH OF THE LICH KING · 3.3.5a
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-cinzel tracking-wider transition-colors hover:text-[hsl(43,65%,52%)]"
          style={{ color: "hsl(215,20%,50%)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[hsl(43,65%,52%)]/40">
              <img src={logoImg} alt="Kaelthas" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-cinzel font-bold text-lg" style={{ color: "hsl(43,65%,52%)" }}>
                KAELTHAS
              </div>
              <div className="font-cinzel text-xs tracking-widest" style={{ color: "hsl(200,85%,55%)" }}>
                User Control Panel
              </div>
            </div>
          </div>

          {/* Tabs */}
          {mode !== "otp" && (
            <div
              className="flex mb-8 rounded-lg p-1"
              style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,15%)" }}
            >
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className="flex-1 py-2.5 rounded-md font-cinzel text-sm tracking-wider transition-all duration-200"
                  style={{
                    background: mode === tab ? "hsl(43,65%,45%)" : "transparent",
                    color: mode === tab ? "hsl(220,47%,5%)" : "hsl(215,20%,55%)",
                    fontWeight: mode === tab ? 700 : 500,
                  }}
                >
                  {tab === "login" ? "Anmelden" : "Registrieren"}
                </button>
              ))}
            </div>
          )}

          {/* OTP Step */}
          {mode === "otp" && (
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{
                  background: "hsla(200,85%,55%,0.1)",
                  border: "1px solid hsla(200,85%,55%,0.3)",
                }}
              >
                <KeyRound className="w-3.5 h-3.5" style={{ color: "hsl(200,85%,55%)" }} />
                <span className="font-cinzel text-xs tracking-widest" style={{ color: "hsl(200,85%,55%)" }}>
                  OTP VERIFIZIERUNG
                </span>
              </div>
              <h1 className="font-cinzel font-bold text-2xl mb-2" style={{ color: "hsl(210,40%,92%)" }}>
                Code eingeben
              </h1>
              <p className="text-sm" style={{ color: "hsl(215,20%,52%)" }}>
                Wir haben einen 4-stelligen Code an <strong style={{ color: "hsl(43,65%,60%)" }}>{email}</strong> gesendet.
              </p>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <>
              <h1 className="font-cinzel font-bold text-2xl mb-2" style={{ color: "hsl(210,40%,92%)" }}>
                Willkommen zurück
              </h1>
              <p className="text-sm mb-8" style={{ color: "hsl(215,20%,52%)" }}>
                Melde dich an und verwalte deinen Account.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    E-MAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="deine@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{
                        background: "hsl(220,42%,8%)",
                        border: "1px solid hsl(220,30%,18%)",
                        color: "hsl(210,40%,90%)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    PASSWORT
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Dein Passwort"
                      className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{
                        background: "hsl(220,42%,8%)",
                        border: "1px solid hsl(220,30%,18%)",
                        color: "hsl(210,40%,90%)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "hsl(215,20%,45%)" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(220,47%,5%)", borderTopColor: "transparent" }} />
                  ) : (
                    <Sword className="w-4 h-4" />
                  )}
                  {loading ? "Anmelden..." : "Anmelden"}
                </button>
              </form>
            </>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <>
              <h1 className="font-cinzel font-bold text-2xl mb-2" style={{ color: "hsl(210,40%,92%)" }}>
                Account erstellen
              </h1>
              <p className="text-sm mb-8" style={{ color: "hsl(215,20%,52%)" }}>
                Tritt dem Abenteuer bei. Kostenlos und sofort spielbereit.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    BENUTZERNAME
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Dein Heldenname"
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    E-MAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="deine@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    PASSWORT
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Mindestens 6 Zeichen"
                      className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(215,20%,45%)" }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                    PASSWORT BESTÄTIGEN
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,45%)" }} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Passwort wiederholen"
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "hsl(220,42%,8%)", border: "1px solid hsl(220,30%,18%)", color: "hsl(210,40%,90%)" }}
                      onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                      onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(220,47%,5%)", borderTopColor: "transparent" }} />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {loading ? "Sende Code..." : "Code senden"}
                </button>
              </form>
            </>
          )}

          {/* OTP Form */}
          {mode === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block font-cinzel text-xs tracking-wider mb-1.5" style={{ color: "hsl(215,20%,60%)" }}>
                  4-STELLIGER CODE
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  required
                  placeholder="0000"
                  maxLength={4}
                  className="w-full text-center py-4 rounded-lg text-2xl font-cinzel font-bold tracking-[0.5em] outline-none transition-all"
                  style={{
                    background: "hsl(220,42%,8%)",
                    border: "1px solid hsl(220,30%,18%)",
                    color: "hsl(43,65%,52%)",
                    letterSpacing: "0.5em",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(43,65%,45%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,30%,18%)")}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(220,47%,5%)", borderTopColor: "transparent" }} />
                ) : (
                  <Sword className="w-4 h-4" />
                )}
                {loading ? "Verifizieren..." : "Account aktivieren"}
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="w-full text-center text-sm transition-colors"
                style={{ color: "hsl(215,20%,50%)" }}
              >
                Zurück zur Registrierung
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
