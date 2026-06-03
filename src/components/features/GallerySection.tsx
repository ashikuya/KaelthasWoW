import { useState } from "react";
import { Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const images = [
  { src: gallery1, title: "Icecrown Citadel", desc: "Raid · 25 Spieler" },
  { src: gallery2, title: "Ulduar", desc: "Raid · 10/25 Spieler" },
  { src: gallery3, title: "Arena PvP", desc: "2v2 · 3v3 · 5v5" },
  { src: gallery4, title: "Dalaran", desc: "Hauptstadt · Northrend" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((l) => (l !== null ? (l - 1 + images.length) % images.length : null));
  const next = () => setLightbox((l) => (l !== null ? (l + 1) % images.length : null));

  return (
    <section id="gallery" className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(200,85%,55%)]/30 bg-[hsl(200,85%,55%)]/8 mb-6">
            <Images className="w-3 h-3 text-[hsl(200,85%,55%)]" />
            <span className="font-cinzel text-xs tracking-widest text-[hsl(200,85%,55%)]">
              SCREENSHOTS
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
            Welt von Kaelthas
          </h2>
          <div className="divider-frost max-w-48 mx-auto mb-4" />
          <p className="max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)", lineHeight: 1.7 }}>
            Erlebe Northrend in seiner ganzen epischen Pracht – von Icecrown bis Dalaran.
          </p>
        </div>

        {/* Grid: 1 large + 3 small */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Featured large image */}
          <div
            className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "16/9" }}
            onClick={() => setLightbox(0)}
          >
            <img
              src={images[0].src}
              alt={images[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,4%)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            >
              <div className="font-cinzel font-bold text-lg" style={{ color: "hsl(43,65%,58%)" }}>
                {images[0].title}
              </div>
              <div className="font-cinzel text-xs tracking-wider" style={{ color: "hsl(200,85%,65%)" }}>
                {images[0].desc}
              </div>
            </div>
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full font-cinzel text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "hsla(43,65%,52%,0.25)", border: "1px solid hsla(43,65%,52%,0.5)", color: "hsl(43,65%,65%)" }}
            >
              FEATURED
            </div>
          </div>

          {/* 3 smaller images */}
          {images.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setLightbox(idx + 1)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,4%)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
              >
                <div className="font-cinzel font-semibold text-sm" style={{ color: "hsl(210,40%,90%)" }}>
                  {img.title}
                </div>
                <div className="font-cinzel text-xs" style={{ color: "hsl(200,85%,60%)" }}>
                  {img.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightbox(null)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightbox].src}
                alt={images[lightbox].title}
                className="w-full rounded-xl"
                style={{ boxShadow: "0 0 60px hsla(43,65%,52%,0.2)" }}
              />
              {/* Caption */}
              <div className="absolute bottom-4 left-4">
                <div className="font-cinzel font-bold text-xl" style={{ color: "hsl(43,65%,58%)" }}>
                  {images[lightbox].title}
                </div>
                <div className="font-cinzel text-sm" style={{ color: "hsl(200,85%,65%)" }}>
                  {images[lightbox].desc}
                </div>
              </div>
              {/* Controls */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all"
                style={{ background: "hsla(0,0%,100%,0.1)", color: "white" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(0,0%,100%,0.1)")}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
                style={{ background: "hsla(43,65%,52%,0.2)", border: "1px solid hsla(43,65%,52%,0.4)", color: "hsl(43,65%,58%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(43,65%,52%,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(43,65%,52%,0.2)")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
                style={{ background: "hsla(43,65%,52%,0.2)", border: "1px solid hsla(43,65%,52%,0.4)", color: "hsl(43,65%,58%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(43,65%,52%,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsla(43,65%,52%,0.2)")}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: i === lightbox ? "hsl(43,65%,52%)" : "hsla(210,40%,60%,0.4)",
                      transform: i === lightbox ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
