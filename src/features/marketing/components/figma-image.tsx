import Image from "next/image";

type FigmaImageProps = {
  name: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  preload?: boolean;
};

/** Local SVGs preserve the crop and aspect ratio of each Figma artwork slot. */
export function FigmaImage({ name, alt = "", ...props }: FigmaImageProps) {
  return <Image src={`/images/marketing/${name}.svg`} alt={alt} unoptimized {...props} />;
}
