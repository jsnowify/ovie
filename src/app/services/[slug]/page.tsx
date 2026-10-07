import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ServiceStory from "@/components/services/ServiceStory";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";
import { serviceDetails } from "@/data/serviceDetails";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map(({ slug }) => ({ slug }));
}

async function getService(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const detail = serviceDetails.find((item) => item.slug === slug);
  const service = services.find((item) => item.id === slug);
  if (!detail || !service) notFound();
  return { detail, service };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { detail, service } = await getService(params);
  return { title: `${service.title} — Ovie Studio`, description: `${detail.headline} ${detail.intro}` };
}

const sectionClass = "px-gutter py-16 md:py-[7vw]";
const labelClass = "text-[0.65rem] tracking-[0.12em] text-ink/60 md:text-xs";
const headingClass = "text-[clamp(2.4rem,5.5vw,6rem)] font-light leading-[1.02] tracking-[-0.06em]";

function Photo({ src, alt, className, sizes }: { src: string; alt: string; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#ab7653] ${className}`}>
      <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image src={src} alt={alt} fill quality={100} sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { detail, service } = await getService(params);

  return (
    <>
      <ServiceStory>
        <section aria-labelledby="service-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-gutter pb-32 pt-32 text-cream md:pb-[4vw]">
          <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={service.images[0]} alt={`${service.title} visualization from Ovie Studio`} fill preload quality={100} sizes="(min-aspect-ratio: 39/20) 100vw, 195vh" className="object-cover" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="relative">
            <p className="mb-6 text-xs tracking-[0.12em]">{service.title.charAt(0) + service.title.slice(1).toLowerCase()}</p>
            <h1 id="service-title" className="max-w-[15ch] text-[clamp(2.8rem,7vw,8rem)] font-light leading-[1.02] tracking-[-0.065em]">{detail.headline}</h1>
            <div className="mt-8 border-t border-cream/30 pt-6 md:mt-12">
              <p className="max-w-[49ch] text-sm font-light leading-relaxed md:text-base">{detail.intro}</p>
            </div>
          </div>
        </section>

        <section id="scope" data-story-reveal aria-labelledby="scope-title" className={`${sectionClass} scroll-mt-20`}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-[6vw]">
            <div>
              <p className={labelClass}>The scope</p>
              <h2 id="scope-title" data-story-heading className={`${headingClass} mt-6`}>What we do.</h2>
              <ul className="mt-8 border-t border-ink/25">
                {detail.scope.map((item) => <li key={item} className="flex gap-6 border-b border-ink/20 py-3 text-sm md:py-4 md:text-base">{item}</li>)}
              </ul>
            </div>
            <Photo src={service.images[1]} alt={`${service.title} study from Ovie Studio`} className="aspect-[4/5] md:mt-12" sizes="(min-width: 768px) 110vw, 244vw" />
          </div>
        </section>

        <section data-story-reveal aria-labelledby="approach-title" className={`${sectionClass} border-t border-ink/20`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className={labelClass}>Our process</p>
            <h2 id="approach-title" data-story-heading className={headingClass}>Our approach.</h2>
          </div>
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_1.1fr] md:gap-[6vw]">
            <Photo src={service.images[2]} alt={`${service.title} process visualization`} className="aspect-square md:self-start" sizes="(min-width: 768px) 95vw, 195vw" />
            <ol>
              {detail.steps.map((step) => <li key={step.title} className="border-t border-ink/25 py-7 first:border-t-0 first:pt-0 md:py-9"><h3 className="text-lg tracking-[-0.03em] md:text-2xl">{step.title}</h3><p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink/75 md:text-base">{step.text}</p></li>)}
            </ol>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="principles-title" className={`${sectionClass} bg-ink text-cream`}>
          <p className="text-xs tracking-[0.12em] text-cream/60">What guides the work</p>
          <h2 id="principles-title" data-story-heading className={`${headingClass} mt-6`}>{detail.principlesTitle}.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-[6vw]">
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {detail.principles.map((principle) => <div key={principle.title} className="border-t border-cream/25 pt-5"><h3 className="max-w-[15ch] text-2xl font-light leading-tight tracking-[-0.04em] md:text-3xl">{principle.title}</h3><p className="mt-4 max-w-[30ch] text-sm font-light leading-relaxed text-cream/75">{principle.text}</p></div>)}
            </div>
            <Photo src={service.images[3]} alt={`${service.title} image illustrating the studio’s principles`} className="aspect-[4/5]" sizes="(min-width: 768px) 110vw, 244vw" />
          </div>
        </section>

        <section data-story-reveal aria-labelledby="considerations-title" className={sectionClass}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-[6vw]">
            <div><p className={labelClass}>The details that matter</p><h2 id="considerations-title" data-story-heading className={`${headingClass} mt-6`}>{detail.considerationsTitle}.</h2></div>
            <ul className="grid gap-x-8 sm:grid-cols-2">{detail.considerations.map((item) => <li key={item} className="flex items-baseline gap-4 border-t border-ink/20 py-5 text-sm md:text-base">{item}</li>)}</ul>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="deliverables-title" className={`${sectionClass} border-t border-ink/20`}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-[6vw]">
            <div><p className={labelClass}>The work made tangible</p><h2 id="deliverables-title" data-story-heading className={`${headingClass} mt-6`}>Deliverables.</h2></div>
            <ul className="grid gap-x-8 sm:grid-cols-2">{detail.deliverables.map((item) => <li key={item} className="border-t border-ink/20 py-5 text-sm md:text-base">{item}</li>)}</ul>
          </div>
        </section>

        <section data-story-reveal aria-labelledby="statement-title" className="relative overflow-hidden bg-ink px-gutter py-24 text-cream md:py-[12vw]">
          <div data-story-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={service.images[4]} alt="" fill quality={100} sizes="(min-width: 768px) 100vw, 244vw" className="object-cover" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/75" />
          <h2 id="statement-title" data-story-heading className="relative max-w-[21ch] text-[clamp(2.4rem,5.7vw,6.5rem)] font-light leading-[1.08] tracking-[-0.055em]">{detail.statement}</h2>
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
