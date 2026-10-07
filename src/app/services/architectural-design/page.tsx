import type { Metadata } from "next";
import Image from "next/image";
import ServiceStory from "@/components/services/ServiceStory";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import WorkCard from "@/components/sections/home/WorkCard";
import { services } from "@/data/services";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Architectural Design — Ovie Studio",
  description: "Spaces shaped by site, structure, and purpose. Explore Ovie’s architectural design scope, approach, principles, and deliverables.",
};

const service = services[0];
const project = projects[0];
const scope = ["Concept development", "Schematic design", "Spatial planning", "Facade studies", "Material direction", "Technical coordination", "Design documentation"];
const steps = [
  { title: "Read the site", text: "Understand climate, orientation, access, views, movement, and constraints." },
  { title: "Define the form", text: "Establish massing, proportion, hierarchy, and spatial relationships." },
  { title: "Develop the system", text: "Refine circulation, openings, structure, materials, and environmental response." },
  { title: "Resolve the details", text: "Translate the concept into buildable drawings and coordinated decisions." },
];
const principles = [
  { title: "Context before form", text: "The building should respond to where it stands." },
  { title: "Material as expression", text: "Concrete, timber, steel, stone, and glass are used honestly." },
  { title: "Light as architecture", text: "Openings are positioned to shape atmosphere, comfort, and movement." },
  { title: "Clarity over excess", text: "Every element should have a reason to exist." },
];
const considerations = ["Site conditions", "Climate and orientation", "Program and user flow", "Structure", "Natural light", "Materiality", "Privacy", "Ventilation", "Long-term adaptability", "Construction feasibility"];
const projectTypes = ["Residential", "Hospitality", "Commercial", "Cultural", "Mixed-use", "Small public buildings"];
const deliverables = ["Site and context studies", "Concept diagrams", "Floor plans", "Sections and elevations", "Massing studies", "Material palettes", "3D visualizations", "Design development drawings", "Coordination documentation"];

const sectionClass = "px-gutter py-16 md:py-[7vw]";
const labelClass = "text-[0.65rem] tracking-[0.12em] text-ink/60 md:text-xs";
const headingClass = "text-[clamp(2.4rem,5.5vw,6rem)] font-light leading-[1.02] tracking-[-0.06em]";

function Photo({ index, className = "aspect-[3/2]", sizes = "(min-width: 768px) 50vw, 100vw", alt }: { index: number; className?: string; sizes?: string; alt: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#ab7653] ${className}`}>
      <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image src={service.images[index]} alt={alt} fill quality={100} sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

export default function ArchitecturalDesignPage() {
  return (
    <>
      <ServiceStory>
        <section aria-labelledby="service-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-gutter pb-32 pt-32 text-cream md:pb-[4vw]">
          <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={service.images[0]} alt="Architectural design visualization from Ovie Studio" fill preload quality={100} sizes="(min-aspect-ratio: 39/20) 100vw, 195vh" className="object-cover" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="relative">
            <p className="mb-6 text-xs tracking-[0.12em]">Architectural design</p>
            <h1 id="service-title" className="max-w-[15ch] text-[clamp(2.8rem,7vw,8rem)] font-light leading-[1.02] tracking-[-0.065em]">Spaces shaped by site, structure, and purpose.</h1>
            <div className="mt-8 flex flex-col gap-6 border-t border-cream/30 pt-6 md:mt-12 md:flex-row md:items-end md:justify-between">
              <p className="max-w-[49ch] text-sm font-light leading-relaxed md:text-base">Ovie develops architecture from the conditions of the site outward, balancing spatial clarity, material honesty, climate, and everyday use.</p>
            </div>
          </div>
        </section>

        <section id="scope" data-story-reveal aria-labelledby="scope-title" className={`${sectionClass} scroll-mt-20`}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <div>
              <p className={labelClass}>The scope</p>
              <h2 id="scope-title" data-story-heading className={`${headingClass} mt-6`}>What we do.</h2>
              <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-ink/75 md:text-base">From the first concept to coordinated documentation, we develop the spatial, material, and technical decisions that give a building its clarity.</p>
              <ul className="mt-8 border-t border-ink/25">
                {scope.map((item) => <li key={item} className="flex gap-6 border-b border-ink/20 py-3 text-sm md:py-4 md:text-base">{item}</li>)}
              </ul>
            </div>
            <Photo index={1} alt="Existing Ovie architectural visualization illustrating spatial and material design" className="aspect-[4/5] md:mt-12" sizes="(min-width: 768px) 110vw, 244vw" />
          </div>
        </section>

        <section data-story-reveal aria-labelledby="approach-title" className={`${sectionClass} border-t border-ink/20`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className={labelClass}>From site to structure</p>
            <h2 id="approach-title" data-story-heading className={headingClass}>Our approach.</h2>
          </div>
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_1.1fr] md:gap-[6vw]">
            <Photo index={2} alt="Ovie architectural study exploring building form" className="aspect-square md:self-start" sizes="(min-width: 768px) 95vw, 195vw" />
            <ol>
              {steps.map((step) => <li key={step.title} className="border-t border-ink/25 py-7 first:pt-0 first:border-t-0 md:py-9"><h3 className="text-lg tracking-[-0.03em] md:text-2xl">{step.title}</h3><p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink/75 md:text-base">{step.text}</p></li>)}
            </ol>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="principles-title" className={`${sectionClass} bg-ink text-cream`}>
          <p className="text-xs tracking-[0.12em] text-cream/60">A design language</p>
          <h2 id="principles-title" data-story-heading className={`${headingClass} mt-6`}>Design principles.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-[6vw]">
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {principles.map((principle) => <div key={principle.title} className="border-t border-cream/25 pt-5"><h3 className="max-w-[13ch] text-2xl font-light leading-tight tracking-[-0.04em] md:text-3xl">{principle.title}</h3><p className="mt-4 max-w-[30ch] text-sm font-light leading-relaxed text-cream/75">{principle.text}</p></div>)}
            </div>
            <Photo index={3} alt="Existing architectural design image showing Ovie’s approach to light and material" className="aspect-[4/5]" sizes="(min-width: 768px) 110vw, 244vw" />
          </div>
        </section>

        <section data-story-reveal aria-labelledby="considerations-title" className={sectionClass}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-[6vw]">
            <div><p className={labelClass}>Every decision has context</p><h2 id="considerations-title" data-story-heading className={`${headingClass} mt-6`}>What we<br />consider.</h2></div>
            <ul className="grid gap-x-8 sm:grid-cols-2">{considerations.map((item) => <li key={item} className="flex items-baseline gap-4 border-t border-ink/20 py-5 text-sm md:text-base">{item}</li>)}</ul>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="types-title" className={`${sectionClass} border-t border-ink/20`}>
          <p className={labelClass}>Across scales</p>
          <h2 id="types-title" data-story-heading className={`${headingClass} mt-6`}>Typical project types.</h2>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 md:grid-cols-3">{projectTypes.map((type) => <li key={type} className="border-t border-ink/25 py-6 text-xl font-light tracking-[-0.03em] md:text-2xl">{type}</li>)}</ul>
        </section>

        <section data-story-reveal aria-labelledby="deliverables-title" className={`${sectionClass} border-t border-ink/20`}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-[6vw]">
            <div><p className={labelClass}>The work made tangible</p><h2 id="deliverables-title" data-story-heading className={`${headingClass} mt-6`}>Deliverables.</h2></div>
            <ul className="grid gap-x-8 sm:grid-cols-2">{deliverables.map((item) => <li key={item} className="border-t border-ink/20 py-5 text-sm md:text-base">{item}</li>)}</ul>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="statement-title" className="relative overflow-hidden bg-ink px-gutter py-24 text-cream md:py-[12vw]">
          <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={service.images[4]} alt="" fill quality={100} sizes="(min-width: 768px) 100vw, 244vw" className="object-cover" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/75" />
          <h2 id="statement-title" data-story-heading className="relative max-w-[21ch] text-[clamp(2.4rem,5.7vw,6.5rem)] font-light leading-[1.08] tracking-[-0.055em]">Architecture begins with constraints.<span className="mt-8 block text-cream/70">The design comes from how we respond to them.</span></h2>
        </section>

        <section data-story-reveal aria-labelledby="project-title" className={sectionClass}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <WorkCard project={project} />
            <div className="flex flex-col items-start justify-center">
              <p className={labelClass}>In practice</p>
              <p className="mt-8 text-xs tracking-[0.08em] text-clay">{project.type} / {project.year} / {project.area}</p>
              <h2 id="project-title" data-story-heading className={`${headingClass} mt-5`}>{project.title}</h2>
              <p className="mt-4 text-xs tracking-[0.08em] text-ink/60">{project.location} / {project.status}</p>
              <p className="mt-7 max-w-[43ch] text-sm leading-relaxed md:text-base">{project.summary}</p>
              <p className="mt-5 max-w-[43ch] text-sm leading-relaxed text-ink/75 md:text-base">In Loboc’s humid, rainy climate, an elevated living floor, deep eaves, and cross-ventilation bring passive comfort into the form itself. Narra-toned timber and breathable louvers give the spaces their warmth while responding to sun, rain, and airflow.</p>
              <p className="mt-8 text-xs tracking-[0.08em] text-clay">Select the image to explore the project ↗</p>
            </div>
          </div>
        </section>

        <section id="service-enquiry" data-service-cta data-story-reveal aria-labelledby="enquiry-title" className={`${sectionClass} border-t border-ink/25`}>
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end md:gap-[6vw]">
            <h2 id="enquiry-title" data-story-heading className={`${headingClass} max-w-[15ch]`}>Have a site.<br />Have an idea.<br />Start there.</h2>
            <Button href="/contact/" className="shrink-0">Start a project</Button>
          </div>
        </section>
      </ServiceStory>
      <Footer />
    </>
  );
}
