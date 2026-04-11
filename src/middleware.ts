import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/types";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth", "/auth/callback", "/faq", "/onboarding", "/invite", "/integritetspolicy", "/anvandarvillkor", "/om"];

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/uppgifter",
  "/tidslinje",
  "/nodbroms",
  "/delagare",
  "/tillgangar",
  "/forsakringar",
  "/bouppteckning",
  "/arvskifte",
  "/fullmakt",
  "/kallelse",
  "/avsluta-konton",
  "/kostnader",
  "/installningar",
  "/dokument",
];

export async function middleware(request: NextRequest) {
  // Update the session to refresh auth token
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );
  if (isPublicRoute) {
    return response;
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Create Supabase client to check if user is authenticated
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // If env vars are missing, redirect to auth
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the current user session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If no user or error, redirect to auth
    if (!user || error) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icons|manifest.json|sw.js).*)",
  ],
};
