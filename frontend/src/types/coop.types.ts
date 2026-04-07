export type CoopMember = ProjectMember & {
  id: string;
  isOwner: boolean;
  status?: "online" | "offline";
};
