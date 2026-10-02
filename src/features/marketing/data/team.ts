export type TeamMember = {
  name: string;
  role: string;
  artwork: string;
  width: number;
  height: number;
  bio?: string;
  linkedin?: string;
  memberId?: string;
};

export const team = [
  { name: "Mayun", role: "Project Manager", artwork: "team-mayun.svg", width: 218, height: 219 },
  { name: "Gung", role: "AI Engineer", artwork: "team-gung.svg", width: 218, height: 218 },
  { name: "Abui", role: "Backend Developer", artwork: "team-abui.svg", width: 218, height: 218 },
  { name: ", role: "Frontend Developer", artwork: "team-balq.svg", width: 206, height: 206 },
  { name: "Gabby", role: "Designer", artwork: "team-gabby.svg", width: 201, height: 201 },
] satisfies readonly TeamMember[];
