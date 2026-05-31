export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  faction: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  voted_at: string;
}

export const WOW_CLASSES = [
  "Death Knight",
  "Druid",
  "Hunter",
  "Mage",
  "Paladin",
  "Priest",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
] as const;

export const WOW_CLASS_COLORS: Record<string, string> = {
  "Death Knight": "#C41E3A",
  Druid: "#FF7C0A",
  Hunter: "#AAD372",
  Mage: "#3FC7EB",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF468",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B3A",
};

export const WOW_RACES_ALLIANCE = [
  "Human",
  "Dwarf",
  "Night Elf",
  "Gnome",
  "Draenei",
] as const;

export const WOW_RACES_HORDE = [
  "Orc",
  "Undead",
  "Tauren",
  "Troll",
  "Blood Elf",
] as const;

export const ALL_RACES = [...WOW_RACES_ALLIANCE, ...WOW_RACES_HORDE] as const;
