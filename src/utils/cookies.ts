/**
 * Cookie utility functions for managing session cookies
 */

const SESSION_COOKIE_NAME = "session_id";

/**
 * Set a cookie with the given name, value, and expiration days
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Set the session ID cookie
 */
export function setSessionId(sessionId: string): void {
  setCookie(SESSION_COOKIE_NAME, sessionId, 7); // 7 days expiration
}

/**
 * Get the session ID from cookies
 */
export function getSessionId(): string | null {
  return getCookie(SESSION_COOKIE_NAME);
}

/**
 * Clear the session ID cookie
 */
export function clearSessionId(): void {
  deleteCookie(SESSION_COOKIE_NAME);
}
