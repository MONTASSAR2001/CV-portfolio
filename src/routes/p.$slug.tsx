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

    // 1. Try fetching from the modern 'cvs' table (used by cv-studio.tsx)
    const { data: cvData, error: cvError } = await supabase
      .from("cvs")
      .select("cv_data_json")
      .eq("cv_data_json->publishMeta->>slug", params.slug)
      .maybeSingle();

    if (cvData?.cv_data_json) {
      return { portfolioData: cvData.cv_data_json };
    }

    // 2. Try fetching from the legacy 'portfolios' table (used by portfolio-builder.tsx)
    const { data: legacyData, error: legacyError } = await supabase
      .from("portfolios")
      .select("content_json, template_id")
      .eq("deployed_url", `/p/${params.slug}`)
      .maybeSingle();

    if (legacyData?.content_json) {
      // Map the legacy PortfolioContent to the new PortfolioData format so templates don't crash
      const legacyContent = legacyData.content_json;
      const mappedData = {
        personalInfo: {
          name: legacyContent.headline?.split(" ")[0] || "Professional",
          role: legacyContent.headline || "Professional",
          bio: legacyContent.bio || "",
          email: "",
          socials: {}
        },
        experience: [],
        projects: legacyContent.projects || [],
        education: [],
        skills: legacyContent.skills || [],
        publishMeta: {
          templateId: legacyData.template_id,
          slug: params.slug
        }
      };
      return { portfolioData: mappedData };
    }

    console.warn(`[Loader] No portfolio found in any table for slug: ${params.slug}`);
    throw notFound();
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
