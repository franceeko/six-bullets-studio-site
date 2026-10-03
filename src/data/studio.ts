import { devAvatars } from "@/assets";

export const socialLinks = {
  discord: { label: "Discord", href: "https://discord.gg/ZWZuJVmRMF" },
  roblox: { label: "Roblox Group", href: "https://www.roblox.com/share/g/470296267" },
} as const;

export type DevTag = "Founders" | "Management" | "Dev" | "Art" | "Audio";

export type Dev = {
  id: string;
  name: string;
  role: string;
  tag: DevTag;
  avatar: (typeof devAvatars)[keyof typeof devAvatars];
};

export const devs: Dev[] = [
  {
    id: "francez",
    name: "Francez",
    role: "Founder · Project Manager · UI & Game Designer",
    tag: "Founders",
    avatar: devAvatars.francez,
  },
  {
    id: "samuca",
    name: "Samuca",
    role: "Founder · Project Manager · Game Designer",
    tag: "Founders",
    avatar: devAvatars.samuca,
  },
  {
    id: "zark",
    name: "Zark",
    role: "Sub Owner · GFX Artist",
    tag: "Founders",
    avatar: devAvatars.zark,
  },
  {
    id: "thugo",
    name: "Thugo",
    role: "Server Manager",
    tag: "Management",
    avatar: devAvatars.thugo,
  },
  {
    id: "marpuf",
    name: "Marpuf",
    role: "Community Manager",
    tag: "Management",
    avatar: devAvatars.marpuf,
  },
  {
    id: "syntax",
    name: "Syntax",
    role: "Lead Dev · Programmer",
    tag: "Dev",
    avatar: devAvatars.syntax,
  },
  {
    id: "yuki",
    name: "Yuki",
    role: "Lead Dev · Modeler",
    tag: "Dev",
    avatar: devAvatars.yuki,
  },
  {
    id: "stray",
    name: "Stray",
    role: "Lead Dev · Modeler & Builder",
    tag: "Dev",
    avatar: devAvatars.stray,
  },
  {
    id: "eater",
    name: "Eater",
    role: "Game Designer",
    tag: "Dev",
    avatar: devAvatars.eater,
  },
  {
    id: "thug",
    name: "Thug",
    role: "Animator",
    tag: "Art",
    avatar: devAvatars.thug,
  },
  {
    id: "whirle",
    name: "Whirle",
    role: "Animator",
    tag: "Art",
    avatar: devAvatars.whirle,
  },
  {
    id: "poli",
    name: "Poli",
    role: "SFX Artist · Music Composer",
    tag: "Audio",
    avatar: devAvatars.poli,
  },
];
