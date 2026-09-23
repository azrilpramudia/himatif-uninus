import HeroSection from "@/components/sections/home/HeroSection";
import AboutSection from "@/components/sections/home/AboutSection";
import WorkProgramSection from "@/components/sections/home/WorkProgramSection";
import ActivitySection from "@/components/sections/home/ActivitySection";
import EventHighlightSection from "@/components/sections/home/EventHighlight";
import FaqSection from "@/components/sections/home/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorkProgramSection />
      <ActivitySection />
      <EventHighlightSection />
      <FaqSection />
    </>
  );
}

