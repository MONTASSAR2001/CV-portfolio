import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface Article {
  id: string;
  kicker: string;
  headline: string;
  dek: string;
  client: string;
  year: string;
  body: string[];
  metric: string;
}

const ARTICLES: Article[] = [
  {
    id: "a1",
    kicker: "Campaign · Fintech",
    headline: "The Loud Case for Boring Money",
    dek: "A launch campaign that refused to promise the moon — and quintupled sign-ups anyway.",
    client: "Northbank",
    year: "2025",
    metric: "+512% signups",
    body: [
      "The client came to us with a savings product and a graveyard of failed launches. Their competitors were selling rocketship dreams. We sold a chair by the window.",
      "The result: the highest sign-up conversion in category, a Cannes shortlist, and a brand voice guide the team still uses three years later.",
      "Deliverables: manifesto, 40 social units, six long-form editorials, in-product microcopy across 220 screens.",
    ],
  },
  {
    id: "a2",
    kicker: "Long-form · Wellness",
    headline: "How Sleep Became a Product",
    dek: "A 6,000-word essay that reframed a category — and did the work of a full media buy.",
    client: "Nocta",
    year: "2024",
    metric: "1.2M organic reads",
    body: [
      "Nocta wanted a whitepaper. We gave them an essay you could not stop reading. It ran on their site, in three trade magazines, and quietly seeded eighteen months of press.",
      "The piece opened with a scene from a 1970s sleep lab and closed with a promise. In between, it argued that the wellness industry had lost the plot on rest.",
    ],
  },
  {
    id: "a3",
    kicker: "Naming · SaaS",
    headline: "Naming the Unnameable",
    dek: "A four-week sprint from 400 candidates to one word the legal team could not kill.",
    client: "Confidential",
    year: "2025",
    metric: "1 word · 6 markets",
    body: [
      "We ran three rounds of naming, phonetic testing across six markets, and a positioning workshop that ended in the CEO writing on the whiteboard for two hours.",
      "The winning name is short, ownable, and has already outlasted two competing brands. It is also, by contract, not printable here.",
    ],
  },
  {
    id: "a4",
    kicker: "Voice system · Retail",
    headline: "A Grammar for a Grocery Store",
    dek: "How we wrote a 90-page tone guide that a 12,000-person org actually reads.",
    client: "Meridian Foods",
    year: "2024",
    metric: "12,000 people",
    body: [
      "The old guide was a PDF that nobody opened. The new one is a website, a Slack bot, and a printed pocket book that the CEO carries to board meetings.",
      "We wrote 300 example sentences, 50 rewrites, and a diagnostic quiz that any team member can take in six minutes.",
    ],
  },
  {
    id: "a5",
    kicker: "Manifesto · Climate",
    headline: "A Manifesto That Refused to Be Nice",
    dek: "The founding document of a climate-tech coalition — read at a UN session and printed on a wall.",
    client: "Coalition 2040",
    year: "2023",
    metric: "38 signatories",
    body: [
      "The brief was to write something inspiring. We wrote something inconvenient. It quotes a farmer, a banker, and a nine-year-old. It has one adjective per paragraph, on purpose.",
    ],
  },
  {
    id: "a6",
    kicker: "Editorial · Media",
    headline: "Redesigning a Daily Newsletter",
    dek: "A 15-year-old daily got a new voice, a new structure, and a 41% lift in open rates.",
    client: "The Overpass",
    year: "2025",
    metric: "+41% open rate",
    body: [
      "We rewrote the top of the newsletter as a single sentence you can read on a lock screen. We killed six recurring sections. We added one: a footer poem, on Fridays only.",
    ],
  },
];

export function WorkSection() {
  const [open, setOpen] = useState<Article | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const [lead, ...rest] = ARTICLES;

  return (
    <section id="work" className="border-t-[3px] border-ink bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-10">
        <div className="flex items-end justify-between border-b-[3px] border-ink pb-4">
          <div>
            <div className="text-mono text-xs text-muted-foreground">Section B</div>
            <h2 className="text-display mt-2 text-[clamp(2.5rem,7vw,6rem)]">Selected Work</h2>
          </div>
          <div className="text-mono hidden text-xs text-muted-foreground md:block">
            Six of forty-two · 2023—2025
          </div>
        </div>

        {/* Newspaper grid */}
        <div className="mt-8 grid grid-cols-12 gap-6">
          {/* Lead */}
          <article
            onClick={() => setOpen(lead)}
            className="group col-span-12 cursor-pointer border-b border-ink pb-8 md:col-span-8 md:border-r md:border-b-0 md:pr-6"
          >
            <div className="text-mono text-xs text-neon">{lead.kicker}</div>
            <h3 className="text-display mt-3 text-[clamp(2rem,5.5vw,5rem)] group-hover:text-neon">
              {lead.headline}
            </h3>
            <p className="text-serif mt-4 max-w-2xl text-xl leading-snug italic">{lead.dek}</p>
            <div className="mt-5 flex items-center gap-4 text-mono text-xs">
              <span>{lead.client}</span>
              <span className="h-1 w-1 rounded-full bg-ink" />
              <span>{lead.year}</span>
              <span className="h-1 w-1 rounded-full bg-ink" />
              <span className="text-neon">{lead.metric}</span>
            </div>
          </article>

          {/* Sidebar column */}
          <div className="col-span-12 flex flex-col divide-y divide-ink md:col-span-4">
            {rest.slice(0, 2).map((a) => (
              <article
                key={a.id}
                onClick={() => setOpen(a)}
                className="group cursor-pointer py-6 first:pt-0"
              >
                <div className="text-mono text-xs text-muted-foreground">{a.kicker}</div>
                <h4 className="text-display mt-2 text-2xl group-hover:text-neon">{a.headline}</h4>
                <p className="text-serif mt-2 text-base italic">{a.dek}</p>
              </article>
            ))}
          </div>

          {/* Bottom row */}
          {rest.slice(2).map((a) => (
            <article
              key={a.id}
              onClick={() => setOpen(a)}
              className="group col-span-12 cursor-pointer border-t border-ink pt-6 md:col-span-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-mono text-xs text-muted-foreground">{a.kicker}</span>
                <span className="text-mono text-xs text-neon">{a.metric}</span>
              </div>
              <h4 className="text-display mt-3 text-3xl group-hover:text-neon">{a.headline}</h4>
              <p className="text-serif mt-2 text-base italic">{a.dek}</p>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ArticleOverlay article={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ArticleOverlay({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Paper unfold: scaleY then scaleX */}
      <motion.div
        className="relative m-4 w-full max-w-5xl origin-top overflow-hidden bg-paper shadow-[12px_12px_0_0] shadow-neon"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ scaleY: 0.02, scaleX: 0.2, rotateX: -25 }}
        animate={{
          scaleY: [0.02, 0.02, 1],
          scaleX: [0.2, 1, 1],
          rotateX: [-25, 0, 0],
        }}
        exit={{ scaleY: 0.02, scaleX: 0.2, rotateX: -25, opacity: 0 }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: [0.65, 0, 0.35, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fold crease line */}
        <motion.div
          className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-ink/20"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 0.9, times: [0, 0.6, 1] }}
        />

        <div className="max-h-[92vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink bg-paper px-6 py-3">
            <span className="text-mono text-xs">{article.client} · {article.year}</span>
            <button
              onClick={onClose}
              className="text-mono border border-ink px-3 py-1 text-xs hover:bg-neon hover:text-paper hover:border-neon"
            >
              Close ×
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="px-6 py-10 md:px-16 md:py-16"
          >
            <div className="text-mono text-xs text-neon">{article.kicker}</div>
            <h2 className="text-display mt-4 text-[clamp(2rem,6vw,5.5rem)]">{article.headline}</h2>
            <p className="text-serif mt-6 max-w-3xl text-2xl leading-snug italic">{article.dek}</p>

            <div className="mt-8 grid grid-cols-3 gap-6 border-y border-ink py-4">
              <div>
                <div className="text-mono text-[0.65rem] text-muted-foreground">Client</div>
                <div className="text-display mt-1 text-lg">{article.client}</div>
              </div>
              <div>
                <div className="text-mono text-[0.65rem] text-muted-foreground">Year</div>
                <div className="text-display mt-1 text-lg">{article.year}</div>
              </div>
              <div>
                <div className="text-mono text-[0.65rem] text-muted-foreground">Impact</div>
                <div className="text-display mt-1 text-lg text-neon">{article.metric}</div>
              </div>
            </div>

            <div className="mt-10 columns-1 gap-8 md:columns-2 [&>p]:mb-4 [&>p]:break-inside-avoid">
              {article.body.map((p, i) => (
                <p key={i} className="text-serif text-lg leading-relaxed">
                  {i === 0 && (
                    <span className="text-display float-left mr-2 text-6xl leading-none">
                      {p[0]}
                    </span>
                  )}
                  {i === 0 ? p.slice(1) : p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
