import type { Metadata } from "next";
import { Sora } from "next/font/google";
import SmoothScroll from "@/providers/SmoothScroll";
import LoaderProvider from "@/providers/LoaderProvider";
import CaseStudyProvider from "@/providers/CaseStudyProvider";
import PageTransitions from "@/providers/PageTransitions";
import Loader from "@/components/layout/Loader";
import Header from "@/components/layout/Header";
import StickyCta from "@/components/layout/StickyCta";
import HoverLabel from "@/components/layout/HoverLabel";
import { site } from "@/config/site";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: "/ovie.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LoaderProvider>
          <SmoothScroll>
            <Loader />
            <Header />
            <StickyCta />
            <HoverLabel />
            <PageTransitions>
              <CaseStudyProvider>{children}</CaseStudyProvider>
            </PageTransitions>
          </SmoothScroll>
        </LoaderProvider>
      </body>
    </html>
  );
}
