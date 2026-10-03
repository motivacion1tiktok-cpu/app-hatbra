import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WizardClient } from "./WizardClient";

export const dynamic = "force-dynamic";

export interface CategoryOption {
  name: string;
  description: string | null;
}

export default async function NuevoProyectoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Consulta de categorías activas en BD
  const { data } = await supabase
    .from("work_categories")
    .select("name, description")
    .eq("vertical", "reformas")
    .eq("is_active", true)
    .order("sort_order");

  // Fallback defensivo: si la BD no devuelve registros o falla, se mantiene funcional
  const categories: CategoryOption[] = data && data.length > 0 ? data : [
    { name: "Reforma de Baño", description: "Cambio de plato de ducha, alicatados, fontanería" },
    { name: "Reforma de Cocina", description: "Mobiliario, encimeras, alicatado y fontanería" },
    { name: "Reforma Integral", description: "Reforma completa de vivienda o local" },
    { name: "Pintura y Acabados", description: "Aislado de paredes, pintura interior/exterior" },
    { name: "Electricidad e Iluminación", description: "Instalación eléctrica, cuadro y mecanismos" },
  ];

  return <WizardClient categories={categories} />;
}