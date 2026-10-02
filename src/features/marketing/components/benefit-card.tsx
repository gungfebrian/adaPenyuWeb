import { FigmaImage } from "./figma-image";

type BenefitCardProps = {
  title: string;
  description: string;
  variant: "first" | "middle" | "last";
};

const variants = {
  first: {
    name: "benefit-shape-left", width: 429, height: 405,
    artwork: "md:top-[0.9259cqw] md:h-[26.7857cqw] md:w-[28.373cqw]",
    content: "md:pt-[4.3651cqw] md:pl-[5.4233cqw]",
    heading: "md:min-h-[6.6799cqw] md:max-w-[17.9233cqw]",
    description: "md:mt-[2.8439cqw] md:max-w-[19.9735cqw]",
  },
  middle: {
    name: "benefit-shape-middle", width: 489, height: 419,
    artwork: "md:w-[32.3413cqw]",
    content: "md:pt-[4.3651cqw] md:pl-[8.664cqw]",
    heading: "md:min-h-[6.6799cqw] md:max-w-[24.1402cqw]",
    description: "md:mt-[2.8439cqw] md:max-w-[19.9735cqw]",
  },
  last: {
    name: "benefit-shape-right", width: 529, height: 405,
    artwork: "md:top-[0.9259cqw] md:h-[26.7857cqw]",
    content: "md:pt-[3.5714cqw] md:pl-[8.3333cqw]",
    heading: "md:min-h-[8.3333cqw] md:max-w-[21.0979cqw]",
    description: "md:mt-[1.9841cqw] md:max-w-[24.1402cqw]",
  },
} as const;

export function BenefitCard({ title, description, variant }: BenefitCardProps) {
  const placement = variants[variant];
  return (
    <article data-stagger-item className="relative mx-auto min-h-44 w-full max-w-[480px] [perspective:1000px] md:mx-0 md:min-h-[27.7116cqw] md:max-w-none">
      <div className="relative h-full min-h-44 md:min-h-[27.7116cqw]">
      <div data-tilt aria-hidden="true" className={`absolute inset-0 h-full w-full overflow-hidden ${placement.artwork}`}>
        <FigmaImage name={placement.name} width={placement.width} height={placement.height} className="h-full w-full" />
      </div>
      <div className={`relative p-6 md:p-10 md:pr-0 md:pb-0 ${placement.content}`}>
        <h3 className={`font-display text-[28px] leading-[1.25] font-bold md:text-[2.7778cqw] md:leading-[1.2] ${placement.heading}`}>{title}</h3>
        <p className={`mt-3 font-detail text-base leading-[1.5] font-medium md:text-[1.6534cqw] md:leading-[1.32] ${placement.description}`}>{description}</p>
      </div>
      </div>
    </article>
  );
}
