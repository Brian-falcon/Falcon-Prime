"use client";

/**
 * Página de login del panel de administración.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fp-light px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-fp-black">
            Falcon Prime
          </Link>
          <p className="text-sm text-fp-gray mt-1">Panel de administración</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-fp-black mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-fp-black focus:border-fp-black"
            placeholder="admin@falconprime.com"
            required
            autoComplete="email"
          />
          <label className="block text-sm font-medium text-fp-black mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-fp-black focus:border-fp-black"
            required
            autoComplete="current-password"
          />
          {error && (
            <p className="text-sm text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fp-black text-white py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="text-center text-sm text-fp-gray mt-4">
          <Link href="/" className="hover:underline">
            Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  );
}
