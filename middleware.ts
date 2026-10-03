import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Matriz de permisos por ruta y rol
const ROLE_ROUTES = [
  { prefix: "/dashboard/validaciones", roles: ["admin"] },
  { prefix: "/dashboard/usuarios", roles: ["admin"] },
  { prefix: "/dashboard/comparador", roles: ["cliente", "propietario", "admin"] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Obtener el rol del usuario (desde cookies de Supabase/sesión)
  const userRole = request.cookies.get("user-role")?.value || "cliente";

  // 2. Verificar si la ruta actual requiere un rol específico
  const matchedRoute = ROLE_ROUTES.find((route) => pathname.startsWith(route.prefix));

  if (matchedRoute) {
    const isAuthorized = matchedRoute.roles.includes(userRole);

    if (!isAuthorized) {
      // Redirigir al dashboard principal si no tiene permiso
      const redirectUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Configuración de rutas donde se ejecuta el middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};