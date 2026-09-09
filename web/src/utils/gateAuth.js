/**
 * gateAuth.js — Centralized Gate Authentication & Email Validation Utility
 *
 * Enforces the strict rule: A user is NEVER unlocked unless a valid email has been captured
 * in local storage ('soe_user_email') AND the unlock flag is present ('soe_listen_unlocked' === '1').
 *
 * Automatically self-heals: if an orphaned 'soe_listen_unlocked' flag is detected without
 * a valid email, it purges the flag to prevent unauthorized music access.
 */

export const STORAGE_KEY_UNLOCKED = 'soe_listen_unlocked';
export const STORAGE_KEY_EMAIL = 'soe_user_email';
export const STORAGE_KEY_NAME = 'soe_user_name';
export const STORAGE_KEY_PERSONA = 'soe_user_persona';
export const STORAGE_KEY_LEADS = 'soe_captured_leads';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates whether a string is a legitimate email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
};

/**
 * Retrieves the currently captured and verified email, or empty string.
 * @returns {string}
 */
export const getCapturedEmail = () => {
  if (typeof window === 'undefined') return '';
  try {
    const email = localStorage.getItem(STORAGE_KEY_EMAIL);
    if (isValidEmail(email)) {
      return email.trim().toLowerCase();
    }
  } catch {
    // LocalStorage unavailable
  }
  return '';
};

/**
 * Strict gate check:
 * Returns true ONLY if BOTH a verified email AND the unlocked flag are present.
 * If the unlocked flag exists without an email, it automatically deletes the flag.
 * @returns {boolean}
 */
export const isGateUnlocked = () => {
  if (typeof window === 'undefined') return false;
  try {
    const email = getCapturedEmail();
    const isFlagged = localStorage.getItem(STORAGE_KEY_UNLOCKED) === '1';

    if (email && isFlagged) {
      return true;
    }

    // Self-healing: if flag exists without verified email, purge it immediately
    if (isFlagged && !email) {
      localStorage.removeItem(STORAGE_KEY_UNLOCKED);
    }
  } catch {
    // LocalStorage unavailable
  }
  return false;
};

/**
 * Securely unlocks the gate by storing verified email and setting unlock flag.
 * @param {string} email
 * @param {string} [name='']
 * @param {string} [persona='parent']
 * @returns {boolean} True if successfully unlocked
 */
export const setGateUnlocked = (email, name = '', persona = 'parent') => {
  if (typeof window === 'undefined') return false;
  if (!isValidEmail(email)) return false;

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name?.trim() || 'Rhythm Explorer';

  try {
    localStorage.setItem(STORAGE_KEY_EMAIL, cleanEmail);
    if (cleanName) localStorage.setItem(STORAGE_KEY_NAME, cleanName);
    if (persona) localStorage.setItem(STORAGE_KEY_PERSONA, persona);
    localStorage.setItem(STORAGE_KEY_UNLOCKED, '1');
    return true;
  } catch (err) {
    console.warn('LocalStorage error setting gate unlock:', err);
    return false;
  }
};

/**
 * Locks the gate by wiping unlock flags.
 */
export const lockGate = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_UNLOCKED);
    localStorage.removeItem(STORAGE_KEY_EMAIL);
  } catch {
    // ignore
  }
};
