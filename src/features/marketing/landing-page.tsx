import { HeroSection } from "./sections/hero-section";
import { StorySection } from "./sections/story-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { BenefitsSection } from "./sections/benefits-section";
import { ProgressSection } from "./sections/progress-section";
import { AboutSection, ContributionSection, ContactSection, FaqSection, MarketingFooter } from "./sections/community-section";
import { LandingMotion } from "./motion/landing-motion";
import { StoryScene } from "./components/story-scene";

export function LandingPage() {
  return <LandingMotion><main id="main-content" tabIndex={-1} className="bg-paper">
    <StoryScene anchor="home"><HeroSection /></StoryScene>
    <StoryScene anchor="our-project" layer={1}><StorySection /></StoryScene>
    <StoryScene anchor="how-it-works" layer={2}><HowItWorksSection /></StoryScene>
    <StoryScene layer={3}><BenefitsSection /></StoryScene>
    <StoryScene layer={4}><ProgressSection /></StoryScene>
    <StoryScene anchor="about-us" layer={5}><AboutSection /></StoryScene>
    <StoryScene layer={5}><ContributionSection /></StoryScene>
    <StoryScene anchor="contact" layer={5}><ContactSection /></StoryScene>
    <StoryScene anchor="faq" layer={5}><FaqSection /></StoryScene>
    <MarketingFooter />
  </main></LandingMotion>;
}
