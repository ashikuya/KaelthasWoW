import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sword, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "hsl(222,47%,4%)" }}
    >
      <div className="text-center max-w-lg">
        {/* Glow number */}
        <div
          className="font-cinzel font-black mb-4 leading-none"
          style={{
            fontSize: "clamp(6rem, 20vw, 12rem)",
            background: "linear-gradient(180deg, hsl(43,75%,72%) 0%, hsl(43,65%,52%) 50%, hsl(40,60%,32%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px hsla(43,65%,52%,0.4))",
          }}
        >
          404
        </div>

        <div className="divider-gold max-w-xs mx-auto mb-6" />

        <h1
          className="font-cinzel font-bold text-2xl md:text-3xl mb-3"
          style={{ color: "hsl(210,40%,90%)" }}
        >
          Seite nicht gefunden
        </h1>
        <p
          className="font-cinzel text-sm md:text-base mb-8 leading-relaxed"
          style={{ color: "hsl(215,20%,50%)" }}
        >
          Diese Seite existiert nicht – vielleicht wurde sie vom Lichkönig verschlungen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-gold px-8 py-3 rounded-lg text-sm flex items-center gap-2">
            <Home className="w-4 h-4" />
            Zur Startseite
          </Link>
          <Link to="/ucp" className="btn-frost px-8 py-3 rounded-lg text-sm flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Zum UCP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
