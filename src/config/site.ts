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
