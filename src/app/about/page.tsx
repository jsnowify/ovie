import type { Metadata } from "next";
import Image from "next/image";
import ServiceWipeLink from "@/components/ui/ServiceWipeLink";
import ServiceStory from "@/components/services/ServiceStory";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "About Ovie — Ovie Studio",
  description: "Architecture shaped by purpose, material, and place. Discover Ovie’s studio, philosophy, and approach to design.",
};

const sectionClass = "px-gutter py-16 md:py-[7vw]";
const headingClass = "text-[clamp(2.4rem,5.5vw,6rem)] font-light leading-[1.04] tracking-[-0.06em]";
const bodyClass = "max-w-[46ch] text-sm leading-relaxed md:text-base";
const stories = [
  { title: "The studio", headline: "We design from the conditions that already exist.", paragraphs: ["Every project begins with observation.", "The site, its climate, orientation, surrounding landscape, program, limitations, and opportunities all become part of the design process.", "Rather than imposing a predetermined style, we allow these conditions to guide the architecture.", "The result is work that belongs to its place."], project: 2, shot: 2 },
  { title: "Material", headline: "Materials are part of the architecture, not an afterthought.", paragraphs: ["Concrete, timber, steel, stone, glass, and plaster each carry their own weight, texture, and character.", "We use materials for what they are rather than disguising them.", "Weathering, texture, shadow, grain, and imperfection become part of how a space is experienced over time."], project: 1, shot: 2 },
  { title: "Space", headline: "Architecture is experienced in movement.", paragraphs: ["We think beyond individual rooms.", "Thresholds, transitions, openings, courtyards, corridors, views, and changes in scale shape how people understand a building.", "Every space is considered in relation to the next."], project: 3, shot: 1 },
  { title: "Light", headline: "Light gives form its character.", paragraphs: ["Natural light is treated as a material.", "Openings are positioned not only for views, but for atmosphere, comfort, rhythm, shadow, and the changing conditions of the day.", "Architecture should not look the same at every hour."], project: 4, shot: 2 },
];
const steps = [
  { title: "Observe", text: "Understand the site, program, climate, movement, and constraints." },
  { title: "Reduce", text: "Remove what is unnecessary and identify the strongest idea." },
  { title: "Define", text: "Shape the architecture through form, proportion, structure, material, and circulation." },
  { title: "Resolve", text: "Develop every part into a coherent and buildable whole." },
];

function Photo({ project, shot, alt, hero = false }: { project: number; shot: number; alt: string; hero?: boolean }) {
  const source = projects[project];
  return (
    <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
      <Image src={source.images[shot % source.images.length]} alt={alt} fill preload={hero} quality={100} sizes={hero ? "(min-aspect-ratio: 39/20) 100vw, 195vh" : "(min-width: 768px) 110vw, 244vw"} className="object-cover" />
    </div>
  );
}

function Story({ story, reverse = false }: { story: typeof stories[number]; reverse?: boolean }) {
  const id = story.title.toLowerCase().replaceAll(" ", "-");
  return (
    <section data-story-reveal aria-labelledby={id} className={`${sectionClass} border-t border-ink/20`}>
      <p className="mb-8 text-xs tracking-[0.12em] text-ink/60">{story.title}</p>
      <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
        <div className={reverse ? "md:order-2" : ""}>
          <h2 id={id} data-story-heading className={headingClass}>{story.headline}</h2>
          <div className={`${bodyClass} mt-8 space-y-5 text-ink/75`}>
            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className={`relative aspect-[4/5] overflow-hidden bg-[#ab7653] ${reverse ? "md:order-1" : ""}`}>
          <Photo project={story.project} shot={story.shot} alt={`Ovie architectural visualization exploring ${story.title.toLowerCase()}`} />
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <ServiceStory>
        <section aria-labelledby="about-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-gutter pb-32 pt-32 text-cream md:pb-[4vw]">
          <Photo project={0} shot={projects[0].cover} alt="Ovie architecture grounded in its landscape" hero />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="relative">
            <p className="mb-6 text-xs tracking-[0.12em]">About Ovie</p>
            <h1 id="about-title" className="max-w-[16ch] text-[clamp(2.8rem,7vw,8rem)] font-light leading-[1.02] tracking-[-0.065em]">Architecture shaped by purpose, material, and place.</h1>
            <p className={`${bodyClass} mt-8 border-t border-cream/30 pt-6 font-light md:mt-12`}>Ovie is an architecture and design practice focused on creating spaces that are direct, considered, and grounded in their context.</p>
          </div>
        </section>

        <section aria-label="About the practice" className={sectionClass}>
          <div className="grid gap-8 md:ml-[25%] md:grid-cols-2 md:gap-[5vw]">
            <p className={bodyClass}>Our work begins with the essentials: how a place is used, how it responds to climate, how people move through it, and how materials come together to form something lasting.</p>
            <p className={`${bodyClass} text-ink/75`}>We are drawn to architecture that feels honest rather than excessive. Strong forms, clear circulation, natural light, and materials that are allowed to express their own character.</p>
          </div>
        </section>

        <Story story={stories[0]} />

        <section data-story-reveal aria-labelledby="philosophy-title" className={`${sectionClass} bg-ink text-cream`}>
          <p className="text-xs tracking-[0.12em] text-cream/60">Our philosophy</p>
          <h2 id="philosophy-title" data-story-heading className={`${headingClass} mt-6`}>Less decoration.<br />More intention.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <div className={`${bodyClass} space-y-5 text-cream/75`}>
              <p>We believe architecture becomes stronger when unnecessary elements are removed.</p>
              <p>Our approach is rooted in restraint, proportion, and clarity.</p>
            </div>
            <ul>{["Form should have purpose.", "Materials should feel honest.", "Details should support the whole.", "Spaces should work before they impress."].map((item) => <li key={item} className="border-t border-cream/25 py-5 text-lg font-light tracking-[-0.03em] md:text-2xl">{item}</li>)}</ul>
          </div>
        </section>

        {stories.slice(1).map((story, index) => <Story key={story.title} story={story} reverse={index % 2 === 0} />)}

        <section data-story-reveal aria-labelledby="process-title" className={`${sectionClass} border-t border-ink/20`}>
          <p className="text-xs tracking-[0.12em] text-ink/60">How we work</p>
          <h2 id="process-title" data-story-heading className={`${headingClass} mt-6 max-w-[18ch]`}>Observe. Reduce.<br />Define. Resolve.</h2>
          <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step) => <li key={step.title} className="border-t border-ink/25 pt-5"><h3 className="text-2xl font-light tracking-[-0.04em]">{step.title}</h3><p className="mt-4 text-sm leading-relaxed text-ink/75">{step.text}</p></li>)}
          </ol>
        </section>

        <section data-story-reveal aria-labelledby="work-title" className={`${sectionClass} border-t border-ink/20`}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <div>
              <h2 id="work-title" data-story-heading className={headingClass}>Our work.</h2>
              <p className={`${bodyClass} mt-8 text-ink/75`}>Our practice moves across different scales, from individual interiors and houses to larger buildings, construction coordination, and master planning.</p>
              <p className="mt-8 text-2xl font-light tracking-[-0.04em]">Different scales.<br />One design language.</p>
            </div>
            <ul className="border-t border-ink/25">
              {services.map((service) => (
                <li key={service.href} className="border-b border-ink/25">
                  <ServiceWipeLink href={service.href}>{service.title.charAt(0).toUpperCase() + service.title.slice(1).toLowerCase()}</ServiceWipeLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="statement-title" className="relative overflow-hidden bg-ink px-gutter py-24 text-cream md:py-[12vw]">
          <Photo project={2} shot={3} alt="" />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/80" />
          <div className="relative">
            <h2 id="statement-title" data-story-heading className={`${headingClass} max-w-[24ch]`}>We are not interested in architecture that exists only to be seen.</h2>
            <div className={`${bodyClass} mt-10 space-y-5 text-cream/80 md:ml-auto`}>
              <p>We are interested in architecture that can be entered, touched, occupied, weathered, and lived in.</p>
              <p>Architecture that gains character with time.</p>
              <p>Architecture that remains when the trend has passed.</p>
            </div>
          </div>
        </section>

        <section data-service-cta data-story-reveal aria-labelledby="closing-title" className={sectionClass}>
          <h2 id="closing-title" data-story-heading className={headingClass}>Built with intention.</h2>
          <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row md:items-end md:gap-[6vw]">
            <p className={`${bodyClass} text-ink/75`}>Ovie creates spaces where structure, material, landscape, and everyday life are treated as one continuous idea.</p>
            <div className="flex flex-wrap gap-4"><Button href="/work/">View our work</Button><Button href="/contact/">Start a project</Button></div>
          </div>
        </section>
      </ServiceStory>
      <Footer />
    </>
  );
}
