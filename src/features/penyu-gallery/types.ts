export type TurtlePhoto = {
  side: "left" | "right";
  path: string;
  po: number;
  idCodes: string[];
};

export type Sighting = {
  date: string;
  year: number;
  photos: Partial<Record<"left" | "right", TurtlePhoto>>;
};

export type GalleryTurtle = {
  id: string;
  name: string;
  species: "Green";
  firstYear: number;
  lastYear: number;
  primaryPhoto: string;
  sightings: Sighting[];
};
