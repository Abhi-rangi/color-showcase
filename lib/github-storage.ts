// GitHub-based storage for admin color changes
// This allows admin changes to be saved globally without external database

export interface GitHubColorData {
    id: string;
    name: string;
    hex: string;
    rgb: string;
    usage: string;
    category: string;
}

export interface GitHubColorsResponse {
    colors: GitHubColorData[];
    lastUpdated: string;
    version: string;
}

// GitHub repository configuration
const GITHUB_OWNER = 'your-username'; // Replace with your GitHub username
const GITHUB_REPO = 'color-showcase'; // Replace with your repository name
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // GitHub personal access token
const COLORS_FILE_PATH = 'data/colors.json';

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Fetch colors from GitHub
export async function fetchColorsFromGitHub(): Promise<GitHubColorData[]> {
    if (!GITHUB_TOKEN) {
        console.log('GitHub token not configured, using localStorage fallback');
        return [];
    }

    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${COLORS_FILE_PATH}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.log('Colors file not found in GitHub, using defaults');
                return [];
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        console.log('Loaded colors from GitHub:', content.colors);
        return content.colors || [];
    } catch (error) {
        console.error('Error fetching colors from GitHub:', error);
        return [];
    }
}

// Save colors to GitHub
export async function saveColorsToGitHub(colors: GitHubColorData[]): Promise<boolean> {
    if (!GITHUB_TOKEN) {
        console.log('GitHub token not configured, saving to localStorage');
        localStorage.setItem('colorShowcaseColors', JSON.stringify(colors));
        return false;
    }

    try {
        // First, get the current file to get the SHA
        const getResponse = await fetch(
            `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${COLORS_FILE_PATH}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        let sha = '';
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }

        // Prepare the new content
        const content: GitHubColorsResponse = {
            colors,
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        };

        // Create or update the file
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${COLORS_FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update color palette - ${new Date().toISOString()}`,
                    content: btoa(JSON.stringify(content, null, 2)),
                    sha: sha || undefined,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        console.log('Successfully saved colors to GitHub');
        return true;
    } catch (error) {
        console.error('Error saving colors to GitHub:', error);
        // Fallback to localStorage
        localStorage.setItem('colorShowcaseColors', JSON.stringify(colors));
        return false;
    }
}

// Check if GitHub is configured
export function isGitHubConfigured(): boolean {
    return !!(GITHUB_TOKEN && GITHUB_OWNER !== 'your-username' && GITHUB_REPO !== 'color-showcase');
}
