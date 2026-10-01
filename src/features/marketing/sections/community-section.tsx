import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "../components/contact-form";
import { Pattern } from "../components/pattern";
import { TeamProfiles } from "../components/team-profiles";

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
          <div data-reveal className="max-w-[782px] text-left">
            <p className="font-detail text-base font-semibold text-secondary md:text-lg">About Us</p>
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
            <p className="font-display text-xl font-medium text-primary sm:text-2xl">
              Where we come from
            </p>
            <h2 id="academy-title" className="mt-3 max-w-3xl font-display text-3xl font-medium leading-tight text-primary sm:text-4xl md:text-5xl">
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
              <div data-tilt className="relative flex min-h-52 flex-col justify-between sm:min-h-56">
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
        <Pattern variant="accuracy" />
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
      className="scroll-mt-0 min-h-[100svh] bg-paper px-6 pt-28 pb-16 text-primary sm:px-8 md:px-12 md:pt-32 md:pb-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[0.65fr_1.35fr] md:gap-16">
        <h2 data-reveal id="faq-title" className="font-display text-3xl font-medium leading-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <div data-reveal className="divide-y divide-primary/15 border-y border-primary/15">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-lg py-5 font-detail text-base font-semibold motion-safe:transition-colors hover:bg-surface focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-secondary focus-visible:outline-offset-2 active:bg-surface md:px-3 md:py-6 md:text-lg [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-6 shrink-0 group-open:rotate-45 motion-safe:transition-transform motion-reduce:transition-none"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </summary>
              <p className="max-w-2xl px-1 pb-6 font-detail leading-relaxed text-secondary md:px-3">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <footer data-header-theme="dark" data-motion-section className="relative isolate overflow-hidden bg-banner px-6 py-9 text-white sm:px-8 md:px-12 md:py-12">
      <Pattern variant="accuracy" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="#home" aria-label="AdaPenyu home" className="w-fit rounded-lg focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">
          <Image
            src="/images/marketing/footer-wordmark.svg"
            alt="AdaPenyu"
            width={129}
            height={40}
            unoptimized
            className="h-10 w-auto"
          />
        </Link>
        <nav aria-label="Footer navigation" className="relative flex flex-wrap gap-x-6 gap-y-3 font-detail text-sm font-medium text-white/85">
          <Link className="rounded-sm transition-colors hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 motion-reduce:transition-none" href="#home">Home</Link>
          <Link className="rounded-sm transition-colors hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 motion-reduce:transition-none" href="#our-project">Our Project</Link>
          <Link className="rounded-sm transition-colors hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 motion-reduce:transition-none" href="#about-us">About Us</Link>
          <Link className="rounded-sm transition-colors hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 motion-reduce:transition-none" href="#faq">FAQ</Link>
        </nav>
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
