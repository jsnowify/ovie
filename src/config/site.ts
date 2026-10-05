import { videoSources } from "@/lib/cloudinary";

export const site = {
  name: "Ovie",
  description:
    "We shape spaces through raw material, deliberate form, and uncompromising structure.",
} as const;

export const hero = {
  video: videoSources("v1791179684/ovie/compiled"),
  headline: ["Architecture reduced", "to what matters."],
  description:
    "We shape spaces through raw material, deliberate form, and uncompromising structure.",
  cta: { label: "Start a project", href: "#contact" },
} as const;

// Introduction section (id="about"). Its two photos are picked at random from the projects.
export const intro = {
  headline: "Built with intention.",
  lead: "Ovie is an architecture studio exploring the relationship between mass, material, and human space.",
  caption:
    "We believe architecture should feel grounded, purposeful, and honest. Every structure begins with its function, responds to its surroundings, and leaves only what needs to remain.",
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
      { label: "Architectural Design", href: "#services" },
      { label: "Interior Design", href: "#services" },
      { label: "Construction Management", href: "#services" },
      { label: "Master Planning", href: "#services" },
    ],
  },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
