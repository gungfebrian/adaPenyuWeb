import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Render the original logo with a tighter crop; source artwork stays unchanged. */
export async function renderBrandIcon(size: { width: number; height: number }) {
  const artwork = await readFile(join(process.cwd(), "public/Logo/Icon-iOS-Dark-1024x1024@1x.png"));
  const zoom = 1.28;

  return new ImageResponse(
    <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#133045" }}>
      {/* ImageResponse renders raw image data rather than a Next/Image URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${artwork.toString("base64")}`}
        alt=""
        width={size.width * zoom}
        height={size.height * zoom}
        style={{ position: "absolute", left: -size.width * (zoom - 1) / 2, top: -size.height * (zoom - 1) / 2 }}
      />
    </div>,
    size,
  );
}
