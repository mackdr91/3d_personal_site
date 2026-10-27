import { CURATED_GITHUB_REPOS } from '../data/portfolioData';
import { GitHubRepoItem } from '../types/portfolio';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Dart: '#00B4AB',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  GLSL: '#da5b0b',
};

interface GitHubApiRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

export async function fetchGitHubRepos(username: string): Promise<{
  repos: GitHubRepoItem[];
  source: 'live' | 'curated';
}> {
  const cleanUser = username.trim();
  if (!cleanUser) {
    return { repos: CURATED_GITHUB_REPOS, source: 'curated' };
  }

  const cacheKey = `atelier_gh_repos_v2_${cleanUser.toLowerCase()}`;
  try {
    const cachedRaw = sessionStorage.getItem(cacheKey);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw) as GitHubRepoItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { repos: parsed, source: 'live' };
      }
    }
  } catch {
    // Ignore storage read errors
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=30`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      }
    );

    if (!response.ok) {
      return { repos: CURATED_GITHUB_REPOS, source: 'curated' };
    }

    const data = (await response.json()) as GitHubApiRepo[];
    if (!Array.isArray(data) || data.length === 0) {
      return { repos: CURATED_GITHUB_REPOS, source: 'curated' };
    }

    const nonForks = data.filter((repo) => !repo.fork);
    const sourceList = nonForks.length > 0 ? nonForks : data;

    const mapped: GitHubRepoItem[] = sourceList.map((repo) => {
      const lang = repo.language || 'Code';
      return {
        id: repo.id,
        name: repo.name,
        description:
          repo.description ||
          'Repository crafted in the studio — click to inspect source code and commit history on GitHub.',
        language: lang,
        languageColor: LANGUAGE_COLORS[lang] || '#D97706',
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        url: repo.html_url,
        homepage: repo.homepage || undefined,
        topics: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 4) : [lang.toLowerCase(), 'github'],
        updatedAt: repo.updated_at ? repo.updated_at.slice(0, 7) : '2026',
      };
    });

    // If user has fewer than 6 public repos, pad with curated studio pieces
    const combined =
      mapped.length < 6
        ? [...mapped, ...CURATED_GITHUB_REPOS.slice(0, 6 - mapped.length)]
        : mapped;

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(combined));
    } catch {
      // Ignore storage quota errors
    }

    return { repos: combined, source: 'live' };
  } catch {
    return { repos: CURATED_GITHUB_REPOS, source: 'curated' };
  }
}
