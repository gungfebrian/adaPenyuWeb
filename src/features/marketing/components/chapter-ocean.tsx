import Image from "next/image";
import elements from "../../../../public/images/Screen/detached-ocean-elements/positions.json";
import { chapterReefs, chapterSilhouettes, stepCorals, type OceanChapter } from "../data/ocean-chapters";
import { OceanBubbles, OceanCurrents } from "./ocean-artwork";

const detachedRoot = "/images/Screen/detached-ocean-elements";

/** Stretch broad contours without cropping away their upper edge. */
function OceanContour({ file, width, height }: { file: string; width: number; height: number }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
      <image href={`${detachedRoot}/More/${file}.svg`} width={width} height={height} />
    </svg>
  );
}

/** The same silhouettes and source-coordinate pivots used by the hero plants. */
function ChapterPlantBed({ side, chapter = "story" }: { side: "left" | "right"; chapter?: OceanChapter }) {
  const left = side === "left";
  const position = chapter === "steps"
    ? left ? "left-0 bottom-0 w-[clamp(135px,13vw,195px)]" : "right-0 bottom-0 w-[clamp(155px,17vw,250px)]"
    : left ? "left-0 bottom-0 w-[clamp(125px,15vw,220px)]" : "right-0 bottom-0 w-[clamp(110px,14vw,205px)]";
  const selection = elements.filter(element =>
    element.collection === (left ? "04-seaweed-left" : "05-coral-right") &&
    element.label === (left ? "left seaweed" : "right coral"),
  );
  return (
    <div data-ocean-depth="30" className={`absolute opacity-80 md:opacity-100 ${position}`}>
      <svg viewBox={left ? "-12 70 225 238" : "233 115 200 194"} className="h-auto w-full overflow-visible">
        {selection.map(element => {
          const { x, y, width, height } = element.bounds;
          return (
            <g key={element.file} data-ocean-sway={element.layerOrder} data-ocean-pivot={`${x + width / 2} ${y + height}`}>
              <image href={`${detachedRoot}/${element.file}`} x={x} y={y} width={width} height={height} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StepsSeabed() {
  return (
    <div data-ocean-depth="14" className="absolute -inset-x-8 bottom-0 h-[clamp(80px,12svh,160px)]">
      <svg viewBox="0 220 1536 115" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <image href="/images/marketing/steps-seabed.svg" x="0" y="220" width="1536" height="180" preserveAspectRatio="none" />
      </svg>
    </div>
  );
}

function StepsCorals() {
  return stepCorals.map((coral, index) => (
    <div key={`${coral.file}:${index}`} data-ocean-depth={coral.depth} className={`absolute ${coral.position}`}>
      <div data-chapter-sway={index + 1} className="origin-bottom">
        <Image src={`/images/Screen/Secondpages/${coral.file}.svg`} alt="" width={coral.width} height={coral.height} unoptimized className="h-auto w-full" />
      </div>
    </div>
  ));
}

/** Restrained deep-ocean layers frame the copy without intercepting input. */
export function ChapterOcean({ chapter }: { chapter: OceanChapter }) {
  const steps = chapter === "steps";
  return (
    <div aria-hidden="true" data-chapter-ocean={chapter} className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] select-none ${steps ? "[mask-image:linear-gradient(to_bottom,transparent,black_80px)]" : "[mask-image:linear-gradient(to_bottom,transparent,black_80px,black_calc(100%-72px),transparent)]"}`}>
      <div className="absolute inset-0 opacity-65 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_78%,transparent)]"><OceanCurrents /></div>
      <div className="absolute inset-0 opacity-60">
        <OceanBubbles className="top-[28%] -left-8 md:left-0" />
        <OceanBubbles className="top-[35%] -right-8 md:right-0" />
      </div>

      {chapterReefs.slice(0, 2).map(reef => (
        <div key={reef.file} data-ocean-depth={reef.depth} className={`absolute -inset-x-8 -bottom-4 ${reef.position}`}>
          <OceanContour file={reef.file} width={reef.width} height={reef.height} />
        </div>
      ))}

      {!steps && chapterSilhouettes.map((plant, index) => (
        <div key={plant.file} data-ocean-depth="20" className={`absolute ${plant.position}`}>
          <div data-chapter-sway={index + 1} className="origin-bottom">
            <Image src={`/images/Screen/Secondpages/${plant.file}.svg`} alt="" width={plant.width} height={plant.height} unoptimized className="h-auto w-full" />
          </div>
        </div>
      ))}

      {steps ? <>
        <StepsCorals />
        <ChapterPlantBed side="left" chapter="steps" />
        <ChapterPlantBed side="right" chapter="steps" />
        <StepsSeabed />
      </> : <>
        <ChapterPlantBed side="left" />
        <ChapterPlantBed side="right" />
        <div data-ocean-depth={chapterReefs[2].depth} className={`absolute -inset-x-8 -bottom-4 ${chapterReefs[2].position}`}>
          <OceanContour file={chapterReefs[2].file} width={chapterReefs[2].width} height={chapterReefs[2].height} />
        </div>
      </>}
    </div>
  );
}
