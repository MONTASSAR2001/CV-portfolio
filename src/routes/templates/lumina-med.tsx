import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/templates/lumina-med/Nav";
import { Hero } from "@/components/templates/lumina-med/Hero";
import { Expertise } from "@/components/templates/lumina-med/Expertise";
import { Testimonials } from "@/components/templates/lumina-med/Testimonials";
import { About } from "@/components/templates/lumina-med/About";
import { Contact } from "@/components/templates/lumina-med/Contact";
import type { PortfolioData } from "@/components/portfolio-builder/types";

export const Route = createFileRoute("/templates/lumina-med")({
  component: Index,
});

function Index({ data }: { data?: PortfolioData }) {
  return (
    <motion.main
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-background"
    >
      <Nav data={data} />
      <Hero data={data} />
      <Expertise data={data} />
      <Testimonials data={data} />
      <About data={data} />
      <Contact data={data} />
    </motion.main>
  );
}
