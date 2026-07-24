import { CyberBackground } from '@/components/cyber-background'
import { SiteNav } from '@/components/site-nav'
import { HeroSection } from '@/components/hero-section'
import { StatsSection } from '@/components/stats-section'
import { ProjectsSection } from '@/components/projects-section'
import { SkillsSection } from '@/components/skills-section'
import { ContactSection } from '@/components/contact-section'

export default function Page() {
  return (
    <>
      <CyberBackground />
      <SiteNav />
      <main className="relative">
        <HeroSection />
        <div className="relative">
          <StatsSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </div>
      </main>
    </>
  )
}
