import elements from "../../../../public/images/Screen/detached-ocean-elements/positions.json";

const assetRoot = "/images/Screen/detached-ocean-elements";
// Owner's marked screenshot: remove small reef fragments, retain one large right coral.
const omittedHeroElements = new Set([9, 10, 11, 20, 22, 23, 24, 25]);

/** Cropped SVGs retain their source positions on a responsive artwork canvas. */
function OceanElements({ collection, from, to, sway = false }: { collection: string; from: number; to: number; sway?: boolean }) {
  const selection = elements.filter(element => element.collection === collection && element.layerOrder >= from && element.layerOrder <= to && (collection !== "01-ocean-reef" || !omittedHeroElements.has(element.layerOrder)));
  return (
    <svg viewBox={selection[0].originalViewBox} preserveAspectRatio="none" className="h-full w-full overflow-visible">
      {selection.map(element => {
        const bounds = element.bounds;
        const plant = sway && (element.label === "left seaweed" || element.label === "right coral");
        return (
          <g key={element.file} data-ocean-sway={plant ? element.layerOrder : undefined} data-ocean-bubble={element.label === "bubble" ? element.layerOrder : undefined} data-ocean-pivot={`${bounds.x + bounds.width / 2} ${bounds.y + bounds.height}`}>
            <g data-bubble-response={element.label === "bubble" ? element.layerOrder : undefined} data-ocean-pivot={`${bounds.x + bounds.width / 2} ${bounds.y + bounds.height / 2}`}>
              <image href={`${assetRoot}/${element.file}`} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} preserveAspectRatio="none" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export function OceanReef({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const hero = variant === "hero";
  const collection = hero ? "01-ocean-reef" : "02-low-wave-footer";
  const layers = hero
    ? [{ from: 1, to: 3, depth: 14 }, { from: 4, to: 11, depth: 30 }, { from: 12, to: 13, depth: 48 }, { from: 14, to: 25, depth: 48 }]
    : [{ from: 1, to: 1, depth: 10 }, { from: 2, to: 2, depth: 20 }, { from: 3, to: 17, depth: 30 }];
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 [clip-path:inset(-80px_0_0_0)] ${hero ? "h-[180px] sm:h-[240px] md:h-[300px]" : "h-[110px] opacity-30 sm:h-[140px]"}`}>
      {layers.map(layer => (
        <div key={layer.from} data-ocean-depth={layer.depth} className="absolute inset-x-0 -inset-y-8">
          <OceanElements collection={collection} from={layer.from} to={layer.to} sway={layer.to > 13} />
        </div>
      ))}
    </div>
  );
}

export function OceanBubbles({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute h-[180px] w-[120px] opacity-70 sm:h-[270px] sm:w-[180px] ${className}`}>
      <div data-ocean-depth="64" className="relative h-full w-full">
        <div data-ocean-bubbles className="relative h-full w-full">
          <OceanElements collection="06-bubbles" from={1} to={7} />
        </div>
      </div>
    </div>
  );
}

export function OceanCurrents() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-40">
      {[1, 2, 3, 4].map(order => (
        <div key={order} data-ocean-depth={12 + order * 6} className="absolute inset-x-0 -inset-y-6">
          <div data-ocean-current={order} className="h-full w-full">
            <OceanElements collection="07-ocean-currents" from={order} to={order} />
          </div>
        </div>
      ))}
    </div>
  );
}
