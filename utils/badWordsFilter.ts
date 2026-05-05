import { Filter } from 'bad-words';

const filter = new Filter();

// Add any extra words you want to block (optional)
// filter.addWords('extraword1', 'extraword2');

export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Check if text contains profanity
 */
export const containsProfanity = (text: string): boolean => {
  if (!text || text.trim() === '') return false;
  try {
    return filter.isProfane(text);
  } catch {
    return false;
  }
};

/**
 * Clean profanity from text (replaces with ***)
 */
export const cleanText = (text: string): string => {
  if (!text || text.trim() === '') return text;
  try {
    return filter.clean(text);
  } catch {
    return text;
  }
};

/**
 * Validate a username — no profanity, required field
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') {
    return { valid: false, message: 'Username is required.' };
  }
  if (containsProfanity(username)) {
    return { valid: false, message: 'Username contains inappropriate language.' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate a full name — no profanity, required field
 */
export const validateFullName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Full name is required.' };
  }
  if (containsProfanity(name)) {
    return { valid: false, message: 'Name contains inappropriate language.' };
  }
  return { valid: true, message: '' };
};
