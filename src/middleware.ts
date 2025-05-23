import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { verifyJwt } from "@/utils/jwt";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Define route configurations (without locale prefix)
const ROUTE_CONFIG = {
  // Routes that require authentication
  protected: ["/dashboard", "/profile", "/settings", "/account", "/admin"],
  // Routes that should redirect if already authenticated
  auth: ["/login", "/register", "/forgot-password", "/reset-password"],
  // Public routes (optional, for clarity)
  public: ["/", "/about", "/contact"],
} as const;

/**
 * Extract locale and pathname from URL based on your routing config
 */
function extractLocaleAndPath(pathname: string): {
  locale: string;
  pathWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];

  // Check if first segment is a supported locale
  if (routing.locales.includes(possibleLocale as "en" | "vi")) {
    return {
      locale: possibleLocale,
      pathWithoutLocale: "/" + segments.slice(1).join("/") || "/",
    };
  }

  return {
    locale: routing.defaultLocale,
    pathWithoutLocale: pathname,
  };
}

/**
 * Check if a path matches any of the given patterns
 */
function matchesPath(pathname: string, paths: readonly string[]): boolean {
  // Normalize pathname to handle trailing slashes
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  return paths.some((path) => {
    const normalizedPattern = path === "/" ? "/" : path.replace(/\/$/, "");
    return (
      normalizedPath === normalizedPattern ||
      normalizedPath.startsWith(`${normalizedPattern}/`)
    );
  });
}

/**
 * Get user authentication status
 */
async function getAuthStatus(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;

  if (!authToken) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = await verifyJwt(authToken);
    return {
      isAuthenticated: !!user,
      user,
    };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Create localized redirect URL
 */
function createLocalizedRedirect(
  request: NextRequest,
  targetPath: string,
  locale: string,
  searchParams?: Record<string, string>
): NextResponse {
  // Build the localized path - always prefix with locale since no localePrefix config
  const localizedPath = `/${locale}${targetPath}`;

  const url = new URL(localizedPath, request.url);

  // Add search parameters
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return NextResponse.redirect(url);
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth logic for API routes, static files, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.includes(".")
  ) {
    return intlMiddleware(request);
  }

  try {
    // Extract locale and path without locale
    const { locale, pathWithoutLocale } = extractLocaleAndPath(pathname);

    // Get authentication status
    const { isAuthenticated } = await getAuthStatus(request);

    // Handle protected routes
    if (matchesPath(pathWithoutLocale, ROUTE_CONFIG.protected)) {
      if (!isAuthenticated) {
        return createLocalizedRedirect(request, "/login", locale, {
          from: pathname,
          message: "Please login to access this page",
        });
      }
    }

    // Handle auth routes (redirect if already authenticated)
    if (matchesPath(pathWithoutLocale, ROUTE_CONFIG.auth)) {
      if (isAuthenticated) {
        // Get intended destination or default to dashboard
        const intendedPath = request.nextUrl.searchParams.get("from");

        if (intendedPath) {
          // Extract path without locale from intended path
          const { pathWithoutLocale: targetPath } =
            extractLocaleAndPath(intendedPath);
          return createLocalizedRedirect(request, targetPath, locale);
        }

        // Default redirect to dashboard
        return createLocalizedRedirect(request, "/dashboard", locale);
      }
    }

    // Run the internationalization middleware
    const response = intlMiddleware(request);

    // Add user info to headers if authenticated (for server components)
    if (response) {
      // Add security headers
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
      );
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, still run i18n middleware but handle auth errors
    const { locale, pathWithoutLocale } = extractLocaleAndPath(pathname);

    // If it's a protected route and there's an auth error, redirect to login
    if (matchesPath(pathWithoutLocale, ROUTE_CONFIG.protected)) {
      return createLocalizedRedirect(request, "/login", locale, {
        error: "Authentication error occurred",
      });
    }

    // Otherwise, just run the i18n middleware
    return intlMiddleware(request);
  }
}

export const config = {
  // Match only internationalized pathnames (keeping your existing config)
  matcher: ["/", "/(en|vi)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

// ------------------------------------------------------
// back to original code
// import { routing } from "@/i18n/routing";
// import createMiddleware from "next-intl/middleware";

// export default createMiddleware(routing);

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ["/", "/(en|vi)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
// };
