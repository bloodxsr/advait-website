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
  name: "Bivash Kumar",
  email: "bivash@advait.collective",
  headline: "Systems & AI Researcher · Member at Advait Collective",
  year: "3rd Year",
  section: "Section B",
  department: "Computer Science & Engineering",
  bio: "Building systems, distributed AI pipelines, and open-source software. Passionate about autonomous agents, local model run-times, and verifiable computation.",
  techTags: ["Next.js", "Rust", "Python", "PyTorch", "TypeScript", "Docker"],
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  portfolio: "https://advait.collective",
  points: 420,
  rank: "#12",
  projects: [
    {
      id: "1",
      name: "AetherSwarm Engine",
      type: "Open source",
      link: "https://github.com/advait-collective/aetherswarm",
      desc: "Distributed multi-agent execution framework.",
    },
    {
      id: "2",
      name: "LatentMesh Visualizer",
      type: "Individual",
      link: "https://github.com/advait-collective/latentmesh",
      desc: "Client-side neural radiance renderer in WebGL.",
    },
    {
      id: "3",
      name: "ZeroVerif ZK-ML",
      type: "Group",
      link: "https://github.com/advait-collective/zeroverif",
      desc: "Zero-knowledge verification for model inferences.",
    },
  ],
  research: [
    {
      id: "1",
      title: "Zero-Latency Edge Inference Architecture",
      tag: "AI / Systems",
      link: "#",
    },
    {
      id: "2",
      title: "Cryptographic Proof Verification in Neural Models",
      tag: "Security",
      link: "#",
    },
    {
      id: "3",
      title: "Decentralized State Sync for Multi-Agent Collectives",
      tag: "Distributed",
      link: "#",
    },
  ],
  certificates: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      year: "2026",
      issuer: "Amazon Web Services",
    },
    {
      id: "2",
      name: "Advait Hackathon 1st Place — AI Systems Track",
      year: "2026",
      issuer: "Advait Collective",
    },
    {
      id: "3",
      name: "Deep Learning Specialization",
      year: "2025",
      issuer: "Coursera / DeepLearning.AI",
    },
  ],
  blogPosts: [
    {
      id: "1",
      title: "Lessons from Scaling Multi-Agent Systems on Edge Devices",
      date: "Nov 2026",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "Why We Choose Rust for Local Neural Run-times",
      date: "Oct 2026",
      readTime: "8 min read",
    },
  ],
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

