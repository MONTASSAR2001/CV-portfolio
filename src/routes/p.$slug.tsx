import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

import { Portfolio as BlueprintSphere } from "./templates/blueprint-sphere-main";
import { Index as KineticInk } from "./templates/kinetic-ink-main";
import { Portfolio as VibrantGlass } from "./templates/vibrant-glass";
import { Index as GoldenLegacy } from "./templates/golden-legacy";
import { Page as DataScientist } from "./templates/data-scientist";
import { Index as LiquidLens } from "./templates/liquid-lens";
import { Index as NeonCanvas } from "./templates/neon-canvas";
import { Index as FutureForward } from "./templates/future-forward";
import { Index as LuminaMed } from "./templates/lumina-med";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    // We search the cvs table for a record where cv_data_json contains our publishMeta slug
    const { data, error } = await supabase
      .from("cvs")
      .select("cv_data_json")
      .contains("cv_data_json", { publishMeta: { slug: params.slug } })
      .single();

    if (error || !data) {
      throw notFound();
    }
    
    return { portfolioData: data.cv_data_json };
  },
  component: PublishedPortfolio,
});

function PublishedPortfolio() {
  const { portfolioData } = Route.useLoaderData();
  const templateId = portfolioData?.publishMeta?.templateId || "blueprint-sphere-main";

  switch (templateId) {
    case "blueprint-sphere-main": return <BlueprintSphere data={portfolioData} />;
    case "kinetic-ink-main": return <KineticInk data={portfolioData} />;
    case "vibrant-glass": return <VibrantGlass data={portfolioData} />;
    case "golden-legacy": return <GoldenLegacy data={portfolioData} />;
    case "data-scientist": return <DataScientist data={portfolioData} />;
    case "liquid-lens": return <LiquidLens data={portfolioData} />;
    case "neon-canvas": return <NeonCanvas data={portfolioData} />;
    case "future-forward": return <FutureForward data={portfolioData} />;
    case "lumina-med": return <LuminaMed data={portfolioData} />;
    default: return <BlueprintSphere data={portfolioData} />;
  }
}
