export interface ProjectItem {
  id: string;
  name: string;
  type: "Open source" | "Individual" | "Group";
  link: string;
  desc?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  tag: string;
  link: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  year: string;
  issuer?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  date: string;
  readTime: string;
}

export interface UserProfile {
  name: string;
  email: string;
  headline: string;
  year: string;
  section: string;
  department: string;
  bio: string;
  techTags: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  points: number;
  rank: string;
  projects: ProjectItem[];
  research: ResearchItem[];
  certificates: CertificateItem[];
  blogPosts: BlogPostItem[];
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "Verified Member",
  email: "member@advait.collective",
  headline: "Advait Collective Member",
  year: "",
  section: "",
  department: "",
  bio: "",
  techTags: [],
  github: "",
  linkedin: "",
  portfolio: "",
  points: 0,
  rank: "Contributor",
  projects: [],
  research: [],
  certificates: [],
  blogPosts: [],
};

const STORAGE_KEY = "advait_user_profile";

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Also sync name cookie so headers pick it up
    document.cookie = `advait_name=${encodeURIComponent(
      profile.name
    )}; path=/; max-age=604800`;
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

