import Cookies from "js-cookie";

export const COOKIE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  CSRF_TOKEN: "csrfToken",
  TOKEN_VERSION: "tokenVersion",
} as const;

export type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  Cookies.set(name, value, options);
};

export const getCookie = (name: string): string | null => {
  const value = Cookies.get(name);
  return value || null;
};

export const removeCookie = (
  name: string,
  options?: Pick<CookieOptions, "path" | "domain">
): void => {
  Cookies.remove(name, options);
};

export const clearAllCookies = (): void => {
  Object.values(COOKIE_KEYS).forEach((cookieName) => {
    removeCookie(cookieName);
  });
};
