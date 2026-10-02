import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Anti open-redirect: garantiza que solo se redirija a rutas internas dentro de la app
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Si no hay código o falla el intercambio de tokens, redirige al login con parámetro de error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}