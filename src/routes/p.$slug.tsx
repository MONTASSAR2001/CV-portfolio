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
    console.log(`[Loader] Fetching portfolio data for slug: ${params.slug}`);

    // We search the cvs table for a record matching the exact slug inside the JSON payload.
    // Using explicit JSON property path matching for PostgREST.
    const { data, error } = await supabase
      .from("cvs")
      .select("cv_data_json")
      .eq("cv_data_json->publishMeta->>slug", params.slug)
      .maybeSingle(); // Use maybeSingle to prevent PGRST116 (multiple/no rows) from throwing as a hard error prematurely

    if (error) {
      console.error(`[Loader] Supabase fetch error for ${params.slug}:`, error);
      throw notFound();
    }

    if (!data || !data.cv_data_json) {
      console.warn(`[Loader] No portfolio found for slug: ${params.slug}`);
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
