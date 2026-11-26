import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AdaPenyu collects, uses, and protects ranger account information, sighting locations, and sea turtle photographs.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    body: [
      "AdaPenyu is a sea turtle photo-identification and conservation monitoring application designed for authorized marine conservation organizations, researchers, and field rangers. We are committed to protecting your privacy and handling all collected data responsibly.",
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: [
      "To provide core application functionality, AdaPenyu collects and stores only the following categories of data on our secure backend servers:",
    ],
    items: [
      {
        label: "Contact Info (Name and Email Address):",
        detail:
          "Used to authenticate authorized rangers, display organization membership, and attribute recorded sea turtle sightings.",
      },
      {
        label: "Identifiers (User ID):",
        detail:
          "Used internally to associate your account with your conservation organization and logged sighting records.",
      },
      {
        label: "User Content (Photos or Videos):",
        detail:
          "Sea turtle head photographs and body-condition photographs captured or uploaded by you for facial-scale photo-identification and health monitoring.",
      },
      {
        label: "Location (Precise Location):",
        detail:
          "Optional GPS coordinates recorded when you grant location permission or place a sighting pin on the map, used solely to document where sea turtles are observed.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Information",
    body: [
      "All collected information is used strictly for App Functionality:",
    ],
    bullets: [
      "Authenticating ranger and conservation organization accounts.",
      "Identifying individual sea turtles through facial scale matching and side-by-side comparison.",
      "Recording and visualizing sea turtle sightings, timelines, flipper tags, carapace measurements, and body condition logs for your organization.",
      "Providing technical support and maintaining service security and reliability.",
    ],
  },
  {
    id: "tracking-and-sharing",
    title: "4. No Tracking, No Advertising, and Data Sharing",
    items: [
      {
        label: "No Cross-App Tracking:",
        detail:
          "AdaPenyu does not track you across apps or websites owned by other companies and does not access Apple’s Advertising Identifier (IDFA).",
      },
      {
        label: "No Advertising or Data Sales:",
        detail:
          "AdaPenyu displays no third-party advertisements and never sells or rents personal data.",
      },
      {
        label: "Organization Visibility:",
        detail:
          "Sighting logs, measurements, and sea turtle photographs submitted through your account are shared only within your authorized conservation organization for research and conservation monitoring.",
      },
    ],
  },
  {
    id: "device-permissions",
    title: "5. Device Permissions",
    body: [
      "AdaPenyu requests iOS device permissions only when needed for field logging features:",
    ],
    items: [
      {
        label: "Camera:",
        detail: "To capture sea turtle head and body-condition photographs.",
      },
      {
        label: "Photo Library:",
        detail:
          "To upload existing sea turtle photos or save body-condition photos to your library when you explicitly choose Save to Photos.",
      },
      {
        label: "Location (While Using the App):",
        detail: "To tag sea turtle sighting coordinates accurately on the map.",
      },
    ],
    footnote:
      "You can manage or revoke any permission at any time in your device’s Settings.",
  },
  {
    id: "retention-and-deletion",
    title: "6. Data Retention and Account Deletion",
    body: [
      "We retain account and conservation records for as long as your organization’s account remains active or as needed for ongoing conservation monitoring. You may request access to, correction of, or deletion of your account and associated personal data at any time by contacting your organization administrator or emailing us at gunkfebrian@gmail.com.",
    ],
  },
  {
    id: "security",
    title: "7. Security",
    body: [
      "All network traffic between the AdaPenyu app and our servers is encrypted in transit using HTTPS/TLS. Authentication credentials on iOS are stored securely using the system Keychain.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "8. Children’s Privacy",
    body: [
      "AdaPenyu is built for conservation staff, marine biologists, and authorized field volunteers and is not directed toward children under 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    body: [
      "We may update this Privacy Policy periodically as the app evolves. Any updates will be published on this page with an updated effective date.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or would like to request data access or deletion, please contact the AdaPenyu team:",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="px-[var(--page-gutter)] pt-28 pb-20 text-primary outline-none sm:pt-32 sm:pb-24"
    >
      <div className="mx-auto max-w-[52rem]">
        <header className="border-b border-primary/15 pb-8 sm:pb-10">
          <p className="text-sm font-semibold tracking-wide text-secondary uppercase">
            Legal &amp; Privacy
          </p>
          <h1 className="mt-2 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-secondary sm:text-lg">
            Effective Date: November 26, 2026 &middot; Applies to the AdaPenyu iOS
            application and {siteConfig.url.replace("https://", "")}.
          </p>
        </header>

        <div className="space-y-10 pt-8 sm:pt-10">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="space-y-3"
            >
              <h2
                id={`${section.id}-heading`}
                className="text-xl font-semibold tracking-tight text-primary sm:text-2xl"
              >
                {section.title}
              </h2>

              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-secondary"
                >
                  {paragraph}
                </p>
              ))}

              {section.items ? (
                <ul className="list-disc space-y-2.5 pl-5 text-base leading-relaxed text-secondary">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold text-primary">
                        {item.label}
                      </span>{" "}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-secondary">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {section.footnote ? (
                <p className="text-sm leading-relaxed text-secondary">
                  {section.footnote}
                </p>
              ) : null}
            </section>
          ))}

          <div className="rounded-2xl border border-primary/15 bg-white/70 p-6 text-base text-secondary">
            <p>
              <span className="font-semibold text-primary">Email:</span>{" "}
              <a
                href="mailto:gunkfebrian@gmail.com"
                className="underline underline-offset-4 hover:text-primary"
              >
                gunkfebrian@gmail.com
              </a>
            </p>
            <p className="mt-2">
              <span className="font-semibold text-primary">Website:</span>{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                {siteConfig.url}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
