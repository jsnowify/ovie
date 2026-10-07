import { videoSources } from "@/lib/cloudinary";

export const site = {
  name: "Ovie Studio",
  description:
    "We shape spaces through raw material, deliberate form, and uncompromising structure.",
} as const;

export const hero = {
  video: videoSources("v1791179684/ovie/compiled"),
  headline: ["Architecture reduced", "to what matters."],
  description:
    "We shape spaces through raw material, deliberate form, and uncompromising structure.",
  cta: { label: "Start a project", href: "/contact/" },
} as const;

// Introduction section (id="introduction"). Its two photos are picked at random from the projects.
export const intro = {
  headline: "Built with intention.",
  lead: "Ovie is an architecture studio exploring the relationship between mass, material, and human space.",
  caption:
    "We believe architecture should feel grounded, purposeful, and honest. Every structure begins with its function, responds to its surroundings, and leaves only what needs to remain.",
};

// About section (id="about"). Its photo comes from one of the projects (see About.tsx).
export const about = {
  label: "About",
  paragraphs: [
    "Ovie is an architecture practice focused on honest materials and deliberate forms.",
    "Our work sits between restraint and monumentality, creating spaces that feel strong without becoming excessive.",
    "Each project is approached as its own system of relationships between people, structure, landscape, light, and material.",
  ],
};

// Footer / contact section (id="contact").
export const contact = {
  eyebrow: "Have a site in mind?",
  title: "Contact us",
  text: "Tell us where it is, what it needs to become, and what you want it to feel like.",
  email: "hello@ovie.studio",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "/work/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
};

// Philosophy section. Its image comes from one of the projects (see Philosophy.tsx).
export const philosophy = {
  title: "Philosophy",
  tagline: ["Less decoration.", "More architecture."],
  statement:
    "We are drawn to exposed materials, strong geometry, open volume, and the character found in unfinished surfaces.",
  principles: [
    "Concrete is allowed to feel like concrete. Steel remains steel.",
    "Structure becomes part of the expression.",
    "Nothing exists without reason.",
  ],
};

// Approach section. Each step gets one photo from the projects (see Approach.tsx).
export const approach = {
  title: "Approach",
  tagline: "From site to structure.",
  steps: [
    {
      number: "01",
      name: "Observe",
      text: "We study the site, its limitations, climate, movement, and existing conditions.",
    },
    {
      number: "02",
      name: "Reduce",
      text: "Unnecessary elements are removed until the essential idea becomes clear.",
    },
    {
      number: "03",
      name: "Form",
      text: "Volume, proportion, material, and circulation begin shaping the architecture.",
    },
    {
      number: "04",
      name: "Build",
      text: "The concept becomes something physical, functional, and made to endure.",
    },
  ],
};

export type MenuItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

// Services sub-items are placeholders. Rename them to the studio's real services.
export const menu: MenuItem[] = [
  {
    label: "Services",
    children: [
      { label: "Architectural Design", href: "/services/architectural-design/" },
      { label: "Interior Design", href: "/services/interior-design/" },
      { label: "Construction Management", href: "/services/construction-management/" },
      { label: "Master Planning", href: "/services/master-planning/" },
    ],
  },
  { label: "Works", href: "/work/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
