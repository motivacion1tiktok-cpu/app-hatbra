import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/profiles';
import { AppShell } from '@/components/layout/AppShell';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensa en profundidad
  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile();

  const userName =
    profile?.full_name?.trim() || user.email?.split('@')[0] || 'Usuario';
  const role = profile?.role ?? 'client';

  return (
    <AppShell role={role} userName={userName}>
      {children}
    </AppShell>
  );
}