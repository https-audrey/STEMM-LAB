/**
 * Profanity filter utility using the bad-words package.
 * Wrapped in a local module to handle ESM/CJS compatibility with Metro bundler.
 */

// Use require() to force CJS resolution, avoiding Metro ESM issues
const BadWordsFilter = require('bad-words').Filter;

class ProfanityFilter {
  private filter: any;

  constructor() {
    this.filter = new BadWordsFilter();
  }

  /**
   * Check if a string contains profane language.
   */
  isProfane(text: string): boolean {
    try {
      return this.filter.isProfane(text);
    } catch {
      // If the filter fails for any reason, allow the text through
      // rather than blocking the user
      console.warn('Profanity filter check failed');
      return false;
    }
  }

  /**
   * Clean a string by replacing profane words with placeholders.
   */
  clean(text: string): string {
    try {
      return this.filter.clean(text);
    } catch {
      return text;
    }
  }

  /**
   * Add custom words to the blocklist.
   */
  addWords(...words: string[]): void {
    this.filter.addWords(...words);
  }
}

export default ProfanityFilter;
