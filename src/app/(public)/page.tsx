import { BentoSection } from "./_components/sections/bento-section";
import { FooterSection } from "./_components/sections/footer-section";
import { HeroSection } from "./_components/sections/hero-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BentoSection />
      <FooterSection />
    </>
  );
}
