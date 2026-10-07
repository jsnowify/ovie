import type { Metadata } from "next";
import ServiceStory from "@/components/services/ServiceStory";
import WorkCard from "@/components/sections/home/WorkCard";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { projects, type Project } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work — Ovie Studio",
  description: "Explore Ovie’s architectural concepts through site, material, light, and everyday use.",
};
const sectionClass = "px-gutter";

function ProjectCaption({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <div className={`mt-5 border-t border-current/25 pt-5 ${featured ? "grid gap-6 md:grid-cols-2 md:gap-[6vw]" : ""}`}>
      <div>
        <div className="flex justify-between gap-4 text-xs text-current/60"><p>{project.type}</p><p>{project.year}</p></div>
        <h3 className="mt-3 text-[clamp(1.5rem,2.5vw,3rem)] font-light leading-tight tracking-[-0.05em]">{project.title}</h3>
        <p className="mt-3 text-xs text-current/60">{project.location} / {project.area}</p>
      </div>
      {featured && <p className="max-w-[46ch] text-sm leading-relaxed text-current/75 md:pt-1 md:text-base">{project.summary}</p>}
    </div>
  );
}

export default function WorkPage() {
  const featured = projects[0];
  return (
    <>
      <ServiceStory>
        <section aria-labelledby="work-title" className={`${sectionClass} bg-ink pb-16 pt-36 text-cream md:pb-[6vw] md:pt-[12vw]`}>
          <div className="flex items-center justify-between border-b border-cream/25 pb-5 text-xs tracking-[0.08em] text-cream/60"><p>Ovie / Project collection</p><p>{String(projects.length).padStart(2, "0")} projects</p></div>
          <h1 id="work-title" className="mt-10 text-[clamp(4.8rem,14vw,16rem)] font-light leading-[0.95] tracking-[-0.075em]">Work shaped<br />by place.</h1>
          <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-[6vw]">
            <p className="max-w-[43ch] text-sm font-light leading-relaxed text-cream/75 md:text-base">A collection of architectural concepts exploring the relationship between site, structure, material, and everyday life.</p>
            <p className="text-xs text-cream/60">Select a project to explore its story <span aria-hidden="true">↘</span></p>
          </div>
        </section>

        <section aria-labelledby="featured-title" className={`${sectionClass} bg-ink pb-16 text-cream md:pb-[7vw]`}>
          <div className="mb-5 flex items-center justify-between text-xs text-cream/60"><h2 id="featured-title" className="font-normal">Featured project</h2><p>Site / Form / Material</p></div>
          <WorkCard project={featured} initial frameClass="aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9]" />
          <ProjectCaption project={featured} featured />
        </section>

        <section data-story-reveal aria-labelledby="collection-title" className={`${sectionClass} py-16 md:py-[7vw]`}>
          <div className="flex flex-col justify-between gap-6 border-b border-ink/25 pb-6 md:flex-row md:items-end">
            <h2 id="collection-title" data-story-heading className="text-[clamp(2.5rem,5vw,6rem)] font-light leading-none tracking-[-0.06em]">Selected projects.</h2>
            <p className="max-w-[28ch] text-xs leading-relaxed text-ink/60">Different settings. Different constraints.<br />One considered approach.</p>
          </div>
          <ul className="works-list mt-10 grid gap-x-[5vw] gap-y-14 md:mt-16 md:grid-cols-2 md:gap-y-[6vw]">
            {projects.slice(1).map((project, index) => (
              <li key={project.id} className={index % 2 === 1 ? "md:translate-y-[6vw]" : ""}>
                <div className="work"><WorkCard project={project} frameClass={index % 2 === 0 ? "aspect-[4/3] md:aspect-[4/5]" : "aspect-[4/3] md:aspect-square"} /></div>
                <ProjectCaption project={project} />
              </li>
            ))}
          </ul>
          <p className="mt-12 text-xs leading-relaxed text-ink/50 md:mt-[10vw]">These projects are presented as architectural concepts within the Ovie portfolio.</p>
        </section>

        <section data-story-reveal aria-labelledby="statement-title" className={`${sectionClass} bg-clay py-20 text-cream md:py-[10vw]`}>
          <p className="text-xs tracking-[0.08em] text-cream/60">Across the collection</p>
          <h2 id="statement-title" data-story-heading className="mt-8 max-w-[20ch] text-[clamp(2.5rem,6.5vw,7.5rem)] font-light leading-[1.04] tracking-[-0.06em]">The setting changes.<br />The intention remains.</h2>
          <p className="mt-8 max-w-[45ch] text-sm font-light leading-relaxed text-cream/80 md:ml-auto md:text-base">Clear forms. Honest materials. Spaces that respond to the conditions around them.</p>
        </section>

        <section data-service-cta data-story-reveal aria-labelledby="enquiry-title" className={`${sectionClass} py-16 md:py-[7vw]`}>
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end md:gap-[6vw]">
            <h2 id="enquiry-title" data-story-heading className="max-w-[17ch] text-[clamp(2.5rem,5.5vw,6rem)] font-light leading-[1.04] tracking-[-0.06em]">Every project starts<br />with a place.</h2>
            <Button href="/contact/" className="shrink-0">Start a project</Button>
          </div>
        </section>
      </ServiceStory>
      <Footer />
    </>
  );
}
