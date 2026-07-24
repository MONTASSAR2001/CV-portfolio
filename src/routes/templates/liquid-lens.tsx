import { HUD } from "@/components/templates/liquid-lens/HUD";
import { Hero } from "@/components/templates/liquid-lens/Hero";
import { Gallery3D } from "@/components/templates/liquid-lens/Gallery3D";
import { ClientOnly } from "@/components/templates/liquid-lens/ClientOnly";
import heroPoster from "@/assets/hero-poster.jpg";
import { createFileRoute } from "@tanstack/react-router";
import type { PortfolioData } from "@/components/portfolio-builder/types";

export const Route = createFileRoute("/templates/liquid-lens")({
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

export function Index({ data }: { data?: PortfolioData }) {
  const name = data?.personalInfo?.name ?? "A. Vela";
  const bio = data?.personalInfo?.bio ?? "I make images that breathe — slow, deliberate, cut from shadow. Fifteen years behind the lens, from Panavision on a 65mm dolly to a Leica in the rain.";
  const email = data?.personalInfo?.email ?? "hello@studionoir.film";
  
  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      <HUD data={data} />
      <div className="fade-mask" />
      <ClientOnly
        fallback={
          <div
            className="h-screen w-full bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${heroPoster})` }}
          />
        }
      >
        <Hero data={data} />
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
        <Gallery3D data={data} />
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
              {bio}
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                [String(data?.projects?.length ?? 12), "PROJECTS"],
                [String(data?.experience?.length ?? 47), "ENGAGEMENTS"],
                [String(data?.skills?.length ?? 180), "SKILLS"],
                [String(data?.education?.length ?? 3), "QUALIFICATIONS"],
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
                href={`mailto:${email}`}
                className="mt-2 block font-display text-xl text-white underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
              >
                {email}
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
          <span>© {new Date().getFullYear()} · {name.toUpperCase()}</span>
          <span>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </footer>
    </main>
  );
}
