import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_RULES: ReadonlyArray<{ prefix: string; roles: readonly string[] }> = [
  { prefix: "/dashboard/owner", roles: ["owner"] },
  { prefix: "/dashboard/admin", roles: ["admin", "owner"] },
];

const PROTECTED_PREFIXES = ["/dashboard"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function withCookies(target: NextResponse, source: NextResponse): NextResponse {
  source.cookies.getAll().forEach((cookie) =>
    target.cookies.set(cookie.name, cookie.value)
  );
  return target;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[HATBRA] Supabase sin configurar: el proxy pasa sin comprobar sesión.");
      return NextResponse.next();
    }
    throw new Error("[HATBRA] Faltan credenciales de Supabase en producción.");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtected(pathname)) {
    if (pathname.startsWith("/api/")) {
      return withCookies(
        new NextResponse(JSON.stringify({ error: "No autenticado." }), {
          status: 401,
          headers: { "content-type": "application/json" },
        }),
        response
      );
    }
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("next", pathname);
    return withCookies(NextResponse.redirect(login), response);
  }

  const rule = ROLE_RULES.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/")
  );
  if (rule && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role;
    if (typeof role !== "string" || !rule.roles.includes(role)) {
      console.warn(`[HATBRA] Acceso denegado a ${pathname} (rol: ${role ?? "desconocido"})`);
      const dash = request.nextUrl.clone();
      dash.pathname = "/dashboard";
      dash.search = "";
      return withCookies(NextResponse.redirect(dash), response);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};