import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "../components/contact-form";
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
        className="scroll-mt-0 bg-paper px-6 pt-28 pb-20 text-primary sm:px-8 md:px-12 md:pt-32 md:pb-28"
      >
        <div className="mx-auto w-full max-w-6xl">
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
        className="scroll-mt-0 bg-paper px-6 py-12 text-primary sm:px-8 md:px-12 md:py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-6 border-t border-primary/15 pt-10 md:gap-12 md:pt-14">
          <div data-reveal>
            <p className="font-body text-lg font-medium text-secondary sm:text-xl">
              Where we come from
            </p>
            <h2 id="academy-title" className="mt-3 max-w-3xl font-body text-3xl font-semibold leading-tight text-primary sm:text-4xl">
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
            className="h-auto w-[76px] sm:w-[100px] md:w-[132px]"
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
      className="scroll-mt-0 bg-paper px-6 py-16 text-white sm:px-8 md:px-12 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 data-reveal id="contribute-title" className="font-display text-3xl font-medium text-primary sm:text-4xl md:text-5xl">
          Ways to contribute
        </h2>
        <ul data-stagger className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {waysToContribute.map(({ title, description }) => (
            <li key={title} data-stagger-item className="relative isolate min-h-64 overflow-hidden rounded-[28px] bg-banner p-6 shadow-[0_12px_32px_#00263c18] sm:min-h-72 sm:p-7">
              <Pattern variant="accuracy" />
              <div className="relative flex min-h-52 flex-col justify-between sm:min-h-56">
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
      className="scroll-mt-0 bg-paper px-5 py-12 text-white sm:px-8 md:px-12 md:py-16"
    >
      <div className="relative isolate mx-auto grid w-full max-w-6xl gap-10 overflow-hidden rounded-[32px] bg-banner px-6 py-9 shadow-[0_24px_64px_#00263c20] sm:rounded-[40px] sm:px-10 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-14 lg:py-16">
        <Pattern variant="accuracy" parallax={false} />
        <div data-reveal className="relative self-start">
          <p className="font-detail text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
            Contact
          </p>
          <h2 id="contact-title" className="mt-4 max-w-md font-display text-4xl font-medium leading-[1.1] sm:text-5xl">
            Start a conversation!
          </h2>
          <p className="mt-6 max-w-md font-detail text-lg leading-relaxed text-white/85 sm:text-xl">
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
      className="scroll-mt-0 bg-paper px-6 pt-28 pb-14 text-primary sm:px-8 md:px-12 md:pt-28 md:pb-20"
    >
      <div className="mx-auto w-full max-w-[960px]">
        <div data-reveal>
          <p className="font-body text-base font-medium text-secondary sm:text-lg">FAQ</p>
          <h2 id="faq-title" className="mt-4 max-w-[20ch] font-display text-[32px] font-medium leading-[1.2] text-secondary sm:text-[42px]">Frequently asked questions</h2>
        </div>
        <div data-stagger className="mt-8 grid gap-4 sm:mt-10">
          {faqs.map(({ question, answer }) => (
            <details key={question} data-stagger-item className="group rounded-2xl bg-surface sm:rounded-[20px]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 rounded-[inherit] px-5 py-4 font-body text-base font-medium motion-safe:transition-colors hover:bg-primary/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 active:bg-primary/5 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-white">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 group-open:rotate-45 motion-safe:transition-transform motion-reduce:transition-none"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[64ch] px-5 pb-5 font-body leading-relaxed text-secondary sm:px-6">
                {answer}
              </p>
            </details>
          ))}
        </div>
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
    <footer data-header-theme="dark" data-motion-section className="relative isolate overflow-hidden bg-banner px-6 py-9 text-white sm:px-8 sm:py-12 md:px-[3.2%]">
      <Pattern variant="accuracy" parallax={false} />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-5 font-body text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 md:gap-14">
        <Link href="#home" aria-label="AdaPenyu home" className="w-fit rounded-lg focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">
          <Image
            src="/images/marketing/footer-wordmark.svg"
            alt="AdaPenyu"
            width={129}
            height={40}
            unoptimized
            className="h-auto w-24"
          />
        </Link>
        <p>© 2026 AdaPenyu. All rights reserved.</p>
        <a href="mailto:adapenyu@gmail.com" className="w-fit rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">adapenyu@gmail.com</a>
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
