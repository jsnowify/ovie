import { projects } from "@/data/projects";
import WorkCard from "@/components/sections/home/WorkCard";

// Two independent columns (not rows), so the lower works sit tight under the
// ones above them. The right column starts lower for the staggered look.
const columns = [
  projects.filter((_, i) => i % 2 === 0),
  projects.filter((_, i) => i % 2 === 1),
];

/**
 * Slides up over the sticky hero as you scroll.
 * The hero (Hero.tsx) is `sticky top-0`; this panel is a later sibling with a
 * higher z-index, so normal scrolling makes it cover the hero.
 *
 * Hover (see globals.css): the hovered work is dimmed, all the others blur.
 */
export default function SelectedWork() {
  return (
    <section
      id="works"
      aria-labelledby="selected-work-title"
      className="relative z-10 bg-cream px-gutter pb-gutter pt-20 text-ink shadow-[0_-24px_60px_rgba(0,0,0,0.3)] md:pt-32"
    >
      <h2
        id="selected-work-title"
        className="text-[clamp(3rem,10vw,10rem)] font-light uppercase leading-[0.9] tracking-[-0.06em]"
      >
        Selected work
      </h2>

      <div className="works-list mt-16 grid gap-gutter md:mt-28 md:grid-cols-2 md:items-start">
        {columns.map((column, c) => (
          // On mobile the columns disappear (display: contents) and `order`
          // puts the works back in their original sequence.
          <ul
            key={c}
            className={`contents md:flex md:flex-col md:gap-gutter ${c === 1 ? "md:mt-40" : ""}`}
          >
            {column.map((project) => (
              <li
                key={project.id}
                style={{ order: projects.indexOf(project) }}
                className="work"
              >
                <WorkCard project={project} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
