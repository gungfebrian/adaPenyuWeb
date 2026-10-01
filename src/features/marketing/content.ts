export const identificationSteps = [
  { number: "01", title: "Photograph", description: "Take a photo of one or both sides of the sea turtle’s head" },
  { number: "02", title: "Read the pattern", description: "The app detects the unique pattern" },
  { number: "03", title: "Match", description: "AI compares the pattern with previous records to find a possible match" },
] as const;

export const benefits = [
  { variant: "first", title: "Zero contact", description: "Identify turtles from images without adding another tag" },
  { variant: "middle", title: "Shared catalogue", description: "Every sighting builds a shared turtle record" },
  { variant: "last", title: "Evidence trail", description: "Keep photos and observations together for future reference" },
] as const;
