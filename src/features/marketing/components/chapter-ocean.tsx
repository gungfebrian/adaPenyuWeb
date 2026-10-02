import Image from "next/image";
import elements from "../../../../public/images/Screen/detached-ocean-elements/positions.json";
import { chapterReefs, chapterSilhouettes, type OceanChapter } from "../data/ocean-chapters";
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
function ChapterPlantBed({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const selection = elements.filter(element =>
    element.collection === (left ? "04-seaweed-left" : "05-coral-right") &&
    element.label === (left ? "left seaweed" : "right coral"),
  );
  return (
    <div data-ocean-depth="30" className={`absolute bottom-3 opacity-80 md:bottom-5 md:opacity-100 ${left ? "-left-3 w-[clamp(125px,15vw,220px)]" : "-right-2 w-[clamp(110px,14vw,205px)]"}`}>
      <svg viewBox={left ? "-4 80 205 224" : "245 125 180 180"} className="h-auto w-full overflow-visible">
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

function ChapterWave() {
  const waves = elements.filter(element => element.collection === "03-wave-divider");
  return (
    <div data-ocean-depth="14" className="absolute -inset-x-8 -bottom-5 h-[clamp(45px,8svh,95px)] opacity-65">
      <svg viewBox="0 0 1536 180" preserveAspectRatio="none" className="h-full w-full">
        {waves.map(wave => (
          <image key={wave.file} href={`${detachedRoot}/${wave.file}`} {...wave.bounds} preserveAspectRatio="none" />
        ))}
      </svg>
    </div>
  );
}

/** Restrained deep-ocean layers frame the copy without intercepting input. */
export function ChapterOcean({ chapter }: { chapter: OceanChapter }) {
  return (
    <div aria-hidden="true" data-chapter-ocean={chapter} className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] select-none [mask-image:linear-gradient(to_bottom,transparent,black_32px,black_calc(100%-20px),transparent)]">
      <div className="absolute inset-0 opacity-65"><OceanCurrents /></div>
      <div className="absolute inset-0 opacity-60">
        <OceanBubbles className="top-[28%] -left-8 md:left-0" />
        <OceanBubbles className="top-[35%] -right-8 md:right-0" />
      </div>

      {chapterReefs.slice(0, 2).map(reef => (
        <div key={reef.file} data-ocean-depth={reef.depth} className={`absolute -inset-x-8 -bottom-4 ${reef.position}`}>
          <OceanContour file={reef.file} width={reef.width} height={reef.height} />
        </div>
      ))}

      {chapterSilhouettes.map((plant, index) => (
        <div key={plant.file} data-ocean-depth="20" className={`absolute ${plant.position}`}>
          <div data-chapter-sway={index + 1} className="origin-bottom">
            <Image src={`/images/Screen/Secondpages/${plant.file}.svg`} alt="" width={plant.width} height={plant.height} unoptimized className="h-auto w-full" />
          </div>
        </div>
      ))}

      <ChapterPlantBed side="left" />
      <ChapterPlantBed side="right" />
      <div data-ocean-depth={chapterReefs[2].depth} className={`absolute -inset-x-8 -bottom-4 ${chapterReefs[2].position}`}>
        <OceanContour file={chapterReefs[2].file} width={chapterReefs[2].width} height={chapterReefs[2].height} />
      </div>
      {chapter === "steps" && <ChapterWave />}
    </div>
  );
}
