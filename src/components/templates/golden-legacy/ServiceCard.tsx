import type { ReactNode } from "react";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export function ServiceCard({ number, title, description, icon }: ServiceCardProps) {
  return (
    <div className="service-card group relative bg-midnight-deep/60 p-10 backdrop-blur-sm transition-all duration-700 hover:bg-midnight-deep">
      {/* Gold trace border */}
      <span className="pointer-events-none absolute inset-0">
        <span className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-500 ease-out group-hover:w-full group-hover:delay-0" />
        <span className="absolute right-0 top-0 h-0 w-px bg-gold transition-all duration-500 ease-out group-hover:h-full group-hover:delay-[500ms]" />
        <span className="absolute bottom-0 right-0 h-px w-0 bg-gold transition-all duration-500 ease-out group-hover:w-full group-hover:delay-[1000ms]" />
        <span className="absolute bottom-0 left-0 h-0 w-px bg-gold transition-all duration-500 ease-out group-hover:h-full group-hover:delay-[1500ms]" />
      </span>

      <div className="relative">
        <div className="mb-8 flex items-start justify-between">
          <span className="font-serif text-sm tracking-[0.3em] text-gold/70">{number}</span>
          <div className="text-gold transition-transform duration-700 group-hover:-translate-y-1">
            {icon}
          </div>
        </div>
        <h3 className="font-serif text-2xl leading-tight text-ivory">{title}</h3>
        <div className="my-6 h-px w-10 bg-gold/40 transition-all duration-700 group-hover:w-20 group-hover:bg-gold" />
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span>Learn more</span>
          <span className="h-px w-8 bg-gold" />
        </div>
      </div>
    </div>
  );
}
