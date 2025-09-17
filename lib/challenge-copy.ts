const REMOVALS = [
  /\bglowing\b/gi,
  /\bneon\b/gi,
  /\bluminous\b/gi,
  /\bflashcard\b/gi,
  /\bcard\b/gi,
  /\bui\b/gi,
  /\banimated\b/gi,
];

/**
 * Removes presentational adjectives like "glowing" or "flashcard" so the prompt focuses on content.
 */
export const sanitizeChallengePrompt = (prompt: string): string => {
  if (!prompt) return prompt;
  let result = prompt;
  for (const pattern of REMOVALS) {
    result = result.replace(pattern, "");
  }
  result = result
    .replace(/\s{2,}/g, " ")
    .replace(/\s([?.!,])/g, "$1")
    .replace(/\b\s+/g, " ")
    .trim();

  // Ensure the sentence still ends with punctuation
  if (!/[?.!]$/.test(result)) {
    result = `${result}?`;
  }

  // Capitalize first character if stripped replacements lowered it
  return result.charAt(0).toUpperCase() + result.slice(1);
};
