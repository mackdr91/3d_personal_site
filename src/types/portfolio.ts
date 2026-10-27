export type ZoneId = 'overview' | 'drawings' | 'projects' | 'resume' | 'contact';

export interface CameraWaypoint {
  id: ZoneId;
  label: string;
  subtitle: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface DigitalDrawing {
  id: string;
  title: string;
  subtitle: string;
  medium: string;
  year: string;
  dimensions: string;
  description: string;
  palette: [string, string, string, string];
  motif: 'solstice' | 'cyber-botanical' | 'architectural-dream' | 'nocturne-tide' | 'astral-portrait';
  aspect: [number, number]; // width, height in 3D units
  position: [number, number, number];
  rotation?: [number, number, number];
  imageUrl?: string; // Optional external/public image path override
  featuredOnEasel?: boolean;
}

export interface GitHubRepoItem {
  id: number | string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  homepage?: string;
  topics: string[];
  updatedAt: string;
  architectureNote?: string;
}

export interface ResumeMilestone {
  id: string;
  category: 'experience' | 'education' | 'exhibition';
  role: string;
  organization: string;
  period: string;
  location: string;
  highlights: string[];
  accentColor: string;
}

export interface SkillCluster {
  category: string;
  items: string[];
}

export interface ContactProfile {
  artistName: string;
  tagline: string;
  location: string;
  email: string;
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  artstationUrl: string;
  instagramHandle: string;
  availability: string;
}

export type ActiveModalPayload =
  | { type: 'drawing'; item: DigitalDrawing; generatedDataUrl?: string }
  | { type: 'project'; item: GitHubRepoItem }
  | { type: 'resume'; milestone?: ResumeMilestone }
  | { type: 'contact' }
  | null;
