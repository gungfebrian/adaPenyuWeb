import { HeroSection } from "./sections/hero-section";
import { StorySection } from "./sections/story-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { BenefitsSection } from "./sections/benefits-section";
import { ProgressSection } from "./sections/progress-section";
import { AboutSection, ContributionSection, ContactSection, FaqSection, MarketingFooter } from "./sections/community-section";
import { LandingMotion } from "./motion/landing-motion";
import { StoryScene } from "./components/story-scene";

export function LandingPage() {
  return <LandingMotion><main id="main-content" tabIndex={-1} className="bg-paper outline-none [&_section]:outline-none">
    <StoryScene anchor="home"><HeroSection /></StoryScene>
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -top-px bottom-0 left-1/2 w-[var(--scene-width,100vw)] -translate-x-1/2 bg-banner" />
      <StoryScene anchor="our-project" layer={1}><StorySection /></StoryScene>
      <StoryScene anchor="how-it-works" layer={2}><HowItWorksSection /></StoryScene>
    </div>
    <StoryScene layer={3}><BenefitsSection /></StoryScene>
    <StoryScene layer={4}><ProgressSection /></StoryScene>
    <StoryScene anchor="about-us" layer={5}><AboutSection /></StoryScene>
    <StoryScene layer={5}><ContributionSection /></StoryScene>
    <StoryScene anchor="contact" layer={5}><ContactSection /></StoryScene>
    <StoryScene anchor="faq" layer={5}><div className="flex min-h-svh flex-col"><FaqSection /><MarketingFooter /></div></StoryScene>
  </main></LandingMotion>;
}
