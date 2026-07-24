import { createFileRoute } from "@tanstack/react-router";
import { CyberBackground } from '@/components/templates/data-scientist/cyber-background'
import { SiteNav } from '@/components/templates/data-scientist/site-nav'
import { HeroSection } from '@/components/templates/data-scientist/hero-section'
import { StatsSection } from '@/components/templates/data-scientist/stats-section'
import { ProjectsSection } from '@/components/templates/data-scientist/projects-section'
import { SkillsSection } from '@/components/templates/data-scientist/skills-section'
import { ContactSection } from '@/components/templates/data-scientist/contact-section'
import type { PortfolioData } from '@/components/portfolio-builder/types'

export const Route = createFileRoute("/templates/data-scientist")({
  component: Page,
});

export function Page({ data }: { data?: PortfolioData }) {
  return (
    <>
      <CyberBackground />
      <SiteNav data={data} />
      <main className="relative">
        <HeroSection data={data} />
        <div className="relative">
          <StatsSection data={data} />
          <ProjectsSection data={data} />
          <SkillsSection data={data} />
          <ContactSection data={data} />
        </div>
      </main>
    </>
  )
}
