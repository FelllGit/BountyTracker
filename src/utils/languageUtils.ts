/**
 * Extracts unique programming languages from bug bounty projects
 * @param projects Array of bug bounty projects
 * @returns Array of unique programming languages
 */
export const extractUniqueLanguages = (
  projects: Array<{ languages: string[] }>
): string[] => {
  if (!projects || !Array.isArray(projects)) {
    return [];
  }

  return Array.from(
    new Set(
      projects
        .map((project) => project.languages)
        .flat()
        .filter((language) => language && language.trim() !== "")
    )
  ).sort();
};

/**
 * Validates if all languages in array exist in available languages
 * @param languages Array of languages to validate
 * @param availableLanguages Array of available languages
 * @returns boolean indicating if all languages are valid
 */
export const areValidLanguages = (
  languages: string[],
  availableLanguages: string[]
): boolean => {
  if (!languages || !Array.isArray(languages)) {
    return false;
  }

  return languages.every((language) => availableLanguages.includes(language));
};

/**
 * Formats language names according to standard format
 * @param language Language name to format
 * @returns Formatted language name
 */
export const formatLanguageName = (language: string): string => {
  if (!language) return "";

  // Special cases for language names
  const specialCases: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    cpp: "C/C++",
    golang: "Go",
  };

  const trimmedLanguage = language.trim().toLowerCase();
  return specialCases[trimmedLanguage] || language.trim();
};
