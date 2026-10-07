import {
  Hero,
  SelectedWork,
  Introduction,
  Services,
  About,
  Philosophy,
  Marquee,
  Approach,
  CtaMarquee,
  Statement,
} from "@/components/sections/home";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <SelectedWork />
        <Introduction />
        <Services />
        <About />
        <Philosophy />
        <Marquee />
        <Approach />
        <CtaMarquee />
        <Statement />
      </main>
      <Footer />
    </>
  );
}
