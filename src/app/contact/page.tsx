import type { Metadata } from "next";
import Image from "next/image";
import ServiceStory from "@/components/services/ServiceStory";
import InquiryForm from "@/components/contact/InquiryForm";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { contact } from "@/config/site";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Contact — Ovie Studio",
  description: "Start with the site. Share your project, location, and idea with Ovie Studio.",
};
const sectionClass = "px-gutter py-16 md:py-[7vw]";
const headingClass = "text-[clamp(2.4rem,5.5vw,6rem)] font-light leading-[1.04] tracking-[-0.06em]";
const bodyClass = "max-w-[46ch] text-sm leading-relaxed md:text-base";
const project = projects[3];

export default function ContactPage() {
  return (
    <>
      <ServiceStory>
        <section aria-labelledby="contact-page-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-gutter pb-32 pt-32 text-cream md:pb-[4vw]">
          <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]"><Image src={project.images[project.cover]} alt="Ovie architecture responding to its site and surroundings" fill preload quality={100} sizes="(min-aspect-ratio: 39/20) 100vw, 195vh" className="object-cover" /></div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="relative">
            <p className="mb-6 text-xs tracking-[0.12em]">Contact</p>
            <h1 id="contact-page-title" className="max-w-[14ch] text-[clamp(3.5rem,9vw,10rem)] font-light leading-[1.02] tracking-[-0.065em]">Start with<br />the site.</h1>
            <div className="mt-8 grid gap-6 border-t border-cream/30 pt-6 md:mt-12 md:grid-cols-2 md:gap-[6vw]">
              <p className={bodyClass}>Every project begins with a place, a need, and an idea.</p>
              <div className={`${bodyClass} space-y-4 text-cream/80`}><p>Tell us what you are planning, where the project is located, and what you want the space to become.</p><p>We’ll take it from there.</p></div>
            </div>
          </div>
        </section>

        <section id="project-inquiry" data-service-cta data-story-reveal aria-labelledby="inquiry-title" className={`${sectionClass} scroll-mt-24`}>
          <div className="grid gap-12 md:grid-cols-[0.85fr_1.3fr] md:gap-[8vw]">
            <div><p className="text-xs tracking-[0.12em] text-ink/60">Project inquiry</p><h2 id="inquiry-title" data-story-heading className={`${headingClass} mt-6`}>Have a project in mind?</h2><p className={`${bodyClass} mt-6 text-ink/75`}>Share the basic details below and we’ll review your inquiry.</p></div>
            <InquiryForm />
          </div>
        </section>

        <section data-story-reveal aria-labelledby="direct-title" className={`${sectionClass} bg-ink text-cream`}>
          <p className="text-xs tracking-[0.12em] text-cream/60">Direct contact</p>
          <h2 id="direct-title" data-story-heading className={`${headingClass} mt-6 max-w-[18ch]`}>Prefer to reach us directly?</h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-3 md:gap-[5vw]">
            <div className="border-t border-cream/30 pt-5"><dt className="text-xs text-cream/60">Email</dt><dd className="mt-5 text-xl font-light tracking-[-0.03em] md:text-2xl">{contact.email}</dd></div>
            <div className="border-t border-cream/30 pt-5"><dt className="text-xs text-cream/60">Studio hours</dt><dd className="mt-5 text-base leading-relaxed">Monday — Friday<br />9:00 — 18:00</dd></div>
            <div className="border-t border-cream/30 pt-5"><dt className="text-xs text-cream/60">Projects</dt><dd className="mt-5 text-sm leading-relaxed text-cream/80">Available for selected residential, commercial, interior, and master planning work.</dd></div>
          </dl>
          <p className="mt-10 text-xs leading-relaxed text-cream/60">Contact details and studio hours are presented as part of this portfolio concept.</p>
        </section>

        <section data-story-reveal aria-labelledby="begin-title" className={sectionClass}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <div><p className="text-xs tracking-[0.12em] text-ink/60">Before we begin</p><h2 id="begin-title" data-story-heading className={`${headingClass} mt-6`}>Good projects start with clear information.</h2></div>
            <div className={`${bodyClass} space-y-6 text-ink/75 md:pt-10`}><p>The more context you can provide about the site, program, scale, budget, and timeline, the better we can understand the direction of the project from the beginning.</p><p>Drawings, site photos, references, and existing documents can also be included where available.</p></div>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="closing-title" className={`${sectionClass} border-t border-ink/25`}>
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end md:gap-[6vw]">
            <div><h2 id="closing-title" data-story-heading className={`${headingClass} max-w-[17ch]`}>From first idea<br />to built form.</h2><p className="mt-6 text-sm text-ink/75 md:text-base">Let’s begin with the essentials.</p></div>
            <Button href="#project-inquiry" className="shrink-0">Send a project inquiry</Button>
          </div>
        </section>
      </ServiceStory>
      <Footer />
    </>
  );
}
