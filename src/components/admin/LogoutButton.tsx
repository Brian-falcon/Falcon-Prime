"use client";

/**
 * Botón para cerrar sesión en el panel admin.
 * Llama a la API y redirige a /admin/login.
 */
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-fp-gray hover:text-fp-black"
    >
      Cerrar sesión
    </button>
  );
}
