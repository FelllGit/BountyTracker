/**
 * Extracts unique platform names from bug bounty projects
 * @param projects Array of bug bounty projects
 * @returns Array of unique platform names
 */
export const extractUniquePlatforms = (
  projects: Array<{ platform: string }>
): string[] => {
  if (!projects || !Array.isArray(projects)) {
    return [];
  }

  return Array.from(
    new Set(
      projects
        .map((project) => project.platform)
        .filter((platform) => platform && platform.trim() !== "")
    )
  ).sort();
};

/**
 * Validates if a platform exists in the list of available platforms
 * @param platform Platform to validate
 * @param availablePlatforms Array of available platforms
 * @returns boolean indicating if platform is valid
 */
export const isValidPlatform = (
  platform: string,
  availablePlatforms: string[]
): boolean => {
  return availablePlatforms.includes(platform);
};
