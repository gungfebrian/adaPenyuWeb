import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "../components/contact-form";
import { FaqAccordion } from "../components/faq-accordion";
import { Pattern } from "../components/pattern";
import { TeamProfiles } from "../components/team-profiles";
import { FigmaImage } from "../components/figma-image";
import { buttonClasses } from "@/components/ui/button";

const waysToContribute = [
  {
    title: "Interviews",
    description: "Share how you monitor and identify turtles today",
  },
  {
    title: "Practitioner feedback",
    description: "Review our flow and tell us what's missing",
  },
  {
    title: "Photos",
    description: "Contribute turtle photos for development and evaluation",
  },
  {
    title: "Field testing",
    description: "Try the prototype with your team on site",
  },
];

const faqs = [
  {
    question: "How does AdaPenyu recognize a turtle?",
    answer:
      "It looks at the unique facial patterns visible in a turtle photo to help identify an individual.",
  },
  {
    question: "Does this replace tags or satellite tracking?",
    answer:
      "No. Facial pattern identification is designed to complement tags and satellites with a way to recognize a turtle from a photo.",
  },
  {
    question: "Can I use the identification system today?",
    answer:
      "There is a working prototype with promising results. The identification backend and shared catalogue are not connected yet.",
  },
  {
    question: "Which photo formats will uploads support?",
    answer:
      "Photo upload is planned for JPEG and PNG images; the upload flow is not connected yet.",
  },
];

export function AboutSection() {
  return (
    <>
      <section
        id="about-us"
        aria-labelledby="team-title"
        data-motion-section
        className="scroll-mt-0 bg-paper px-[var(--page-gutter)] pt-24 pb-[var(--section-space)] text-primary"
      >
        <div className="mx-auto w-full max-w-[1352px]">
          <div className="flex items-center justify-between gap-6 md:gap-10">
            <div data-reveal className="min-w-0 max-w-[782px] flex-1 text-left">
              <p className="font-body text-base font-medium text-secondary md:text-lg">About Us</p>
              <h2 id="team-title" className="mt-4">
                <span className="sr-only">Citizens of the Sea</span>
                <Image
                  src="/images/marketing/team-title.svg"
                  alt=""
                  aria-hidden="true"
                  width={782}
                  height={101}
                  unoptimized
                  className="h-auto w-full"
                />
              </h2>
            </div>
            <div aria-hidden="true" data-artwork-reveal className="pointer-events-none hidden w-[140px] shrink-0 sm:block lg:w-[180px]">
              <div data-idle="emblem"><FigmaImage name="citizens-turtle" width={388} height={386} className="h-auto w-full" /></div>
            </div>
          </div>

          <TeamProfiles />
        </div>
      </section>

      <section
        id="where-we-come-from"
        aria-labelledby="academy-title"
        data-motion-section
        className="scroll-mt-0 bg-paper px-[var(--page-gutter)] py-[var(--section-space)] text-primary"
      >
        <div className="mx-auto grid w-full max-w-[1352px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:gap-6 md:gap-10">
          <div data-reveal>
            <p className="font-body text-base font-medium text-secondary sm:text-xl">
              Where we come from
            </p>
            <h2 id="academy-title" className="mt-3 max-w-3xl font-body text-2xl font-semibold leading-tight text-primary sm:text-4xl">
              Apple Developer Academy Bali
            </h2>
          </div>
          <Image
            data-idle
            src="/images/marketing/academy-mark.svg"
            alt=""
            aria-hidden="true"
            width={132}
            height={178}
            unoptimized
            className="h-auto w-16 sm:w-[100px] md:w-[132px]"
          />
        </div>
      </section>
    </>
  );
}

export function ContributionSection() {
  return (
    <section
      id="contribute"
      aria-labelledby="contribute-title"
      data-motion-section
      className="scroll-mt-0 bg-paper px-[var(--page-gutter)] py-[var(--section-space)] text-white"
    >
      <div className="mx-auto w-full max-w-[1352px]">
        <h2 data-reveal id="contribute-title" className="font-display text-3xl font-medium text-primary sm:text-4xl md:text-5xl">
          Ways to contribute
        </h2>
        <ul data-stagger className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {waysToContribute.map(({ title, description }) => (
            <li key={title} data-stagger-item className="relative isolate overflow-hidden rounded-[20px] bg-banner p-5 shadow-[0_12px_32px_#00263c18] sm:min-h-72 sm:rounded-[28px] sm:p-7">
              <Pattern variant="accuracy" />
              <div className="relative flex min-h-28 flex-col justify-between gap-5 sm:min-h-56 sm:gap-0">
                <h3 className="font-display text-2xl font-medium leading-tight sm:text-[27px]">{title}</h3>
                <p className="mt-3 font-detail text-base leading-relaxed text-white/85">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-motion-section
      className="scroll-mt-0 bg-paper px-[var(--page-gutter)] pt-24 pb-[var(--section-space)] text-white md:pt-[var(--section-space)]"
    >
      <div className="relative isolate mx-auto grid w-full max-w-[1352px] gap-7 overflow-hidden rounded-[24px] bg-banner px-5 py-7 shadow-[0_24px_64px_#00263c20] sm:gap-10 sm:rounded-[40px] sm:px-10 sm:py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Pattern variant="accuracy" parallax={false} />
        <div data-reveal className="relative self-start">
          <p className="font-detail text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
            Contact
          </p>
          <h2 id="contact-title" className="mt-4 max-w-md font-display text-[32px] font-medium leading-[1.15] text-balance sm:text-5xl sm:leading-[1.1]">
            Start a conversation!
          </h2>
          <p className="mt-4 max-w-md font-detail text-base leading-relaxed text-white/85 sm:mt-6 sm:text-xl">
            Researcher, conservationist, or potential collaborator, we’d love to hear from you!
          </p>
        </div>
        <div data-reveal className="relative">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      data-motion-section
      className="flex-1 scroll-mt-0 bg-paper px-[var(--page-gutter)] pt-24 pb-[var(--section-space)] text-primary [overflow-anchor:none]"
    >
      <div className="mx-auto w-full max-w-[1352px]">
        <div data-reveal>
          <p className="font-body text-base font-medium text-secondary sm:text-lg">FAQ</p>
          <h2 id="faq-title" className="mt-4 max-w-[20ch] font-display text-[32px] font-medium leading-[1.2] text-secondary max-sm:text-balance sm:text-[42px]">Frequently asked questions</h2>
        </div>
        <FaqAccordion items={faqs} />
        <div data-reveal className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <p className="font-body text-base text-secondary sm:text-lg">Still have questions?</p>
          <Link href="#contact" className={buttonClasses("primary", "rounded-2xl")}>Start a conversation <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <footer data-header-theme="dark" data-motion-section className="relative isolate overflow-hidden bg-banner px-[var(--page-gutter)] py-9 text-white [overflow-anchor:none] sm:py-12">
      <Pattern variant="accuracy" parallax={false} />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-5 font-body text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 md:gap-14">
        <Link href="#home" aria-label="AdaPenyu home" className="inline-flex min-h-11 w-fit items-center rounded-lg focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">
          <Image
            src="/images/marketing/wordmark.svg"
            alt="AdaPenyu"
            width={251}
            height={78}
            unoptimized
            className="h-auto w-24 brightness-0 invert"
          />
        </Link>
        <p>© 2026 AdaPenyu. All rights reserved.</p>
        <a href="mailto:adapenyu@gmail.com" className="inline-flex min-h-11 w-fit items-center rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">adapenyu@gmail.com</a>
      </div>
    </footer>
  );
}

export function CommunitySection() {
  return (
    <>
      <AboutSection />
      <ContributionSection />
      <ContactSection />
      <FaqSection />
      <MarketingFooter />
    </>
  );
}
