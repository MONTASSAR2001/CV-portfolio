import { HUD } from "@/components/HUD";
import { Hero } from "@/components/Hero";
import { Gallery3D } from "@/components/Gallery3D";
import { ClientOnly } from "@/components/ClientOnly";
import heroPoster from "@/assets/hero-poster.jpg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A. Vela — Studio Noir · Cinematic Portfolio" },
      {
        name: "description",
        content:
          "A. Vela — cinematographer & photographer. Selected frames, moving pictures, and the space between. A dark, cinematic portfolio in motion.",
      },
      { property: "og:title", content: "A. Vela — Studio Noir · Cinematic Portfolio" },
      {
        property: "og:description",
        content:
          "Selected frames from a cinematographer's field notebook — moving pictures, stills, and the space between.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      <HUD />
      <div className="fade-mask" />
      <ClientOnly
        fallback={
          <div
            className="h-screen w-full bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${heroPoster})` }}
          />
        }
      >
        <Hero />
      </ClientOnly>

      {/* Between-scene marquee */}
      <section className="relative overflow-hidden border-y border-white/5 py-8">
        <div className="mono flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap text-[11px] tracking-[0.4em] text-white/40">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              CANNES · SELECTED 2024
              <span className="text-white/20">◆</span>
              BERLINALE · TALENTS
              <span className="text-white/20">◆</span>
              VOGUE · CONTRIBUTOR
              <span className="text-white/20">◆</span>
              A24 · COMMISSIONED
              <span className="text-white/20">◆</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      <ClientOnly>
        <Gallery3D />
      </ClientOnly>

      {/* About */}
      <section id="about" className="relative border-t border-white/5 px-12 py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono text-[11px] tracking-[0.4em] text-white/40">
              CHAPTER 03 — DOSSIER
            </div>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-3xl font-light leading-tight tracking-tight text-white/90 md:text-5xl">
              I make images that <span className="italic text-white/60">breathe</span> — slow,
              deliberate, cut from shadow. Fifteen years behind the lens, from
              Panavision on a 65mm dolly to a Leica in the rain.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                ["12", "FEATURES"],
                ["47", "SHORTS"],
                ["+180", "CAMPAIGNS"],
                ["3", "AWARDS"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-4xl font-light text-white">{n}</div>
                  <div className="mono mt-2 text-[10px] tracking-[0.3em] text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative border-t border-white/5 px-12 py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mono text-[11px] tracking-[0.4em] text-white/40">
            CHAPTER 04 — CONTACT
          </div>
          <h2 className="mt-6 font-display text-6xl font-light tracking-tight text-white md:text-[10rem] md:leading-[0.9]">
            Let's <span className="italic text-white/60">roll</span>.
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <div className="mono text-[10px] tracking-[0.3em] text-white/40">EMAIL</div>
              <a
                href="mailto:hello@studionoir.film"
                className="mt-2 block font-display text-xl text-white underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
              >
                hello@studionoir.film
              </a>
            </div>
            <div>
              <div className="mono text-[10px] tracking-[0.3em] text-white/40">STUDIO</div>
              <div className="mt-2 font-display text-xl text-white">
                Los Angeles · Paris
              </div>
            </div>
            <div>
              <div className="mono text-[10px] tracking-[0.3em] text-white/40">REPRESENTATION</div>
              <div className="mt-2 font-display text-xl text-white">
                THE UNION AGENCY
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/5 px-12 py-8">
        <div className="mono mx-auto flex max-w-[1400px] items-center justify-between text-[10px] tracking-[0.3em] text-white/30">
          <span>© 2026 · STUDIO NOIR</span>
          <span>SHOT ON ARRI ALEXA 35 · PROCESSED IN DAVINCI</span>
        </div>
      </footer>
    </main>
  );
}
