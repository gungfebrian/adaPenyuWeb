import type { Metadata } from "next";
import { PenyuGalleryPage } from "@/features/penyu-gallery/penyu-gallery-page";

export const metadata: Metadata = {
  title: "Penyu Gallery",
  description:
    "Explore 50 documented green sea turtles and 200 original facial profile photographs across sightings.",
};

export default function Page() {
  return <PenyuGalleryPage />;
}
