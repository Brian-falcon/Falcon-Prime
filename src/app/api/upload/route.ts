/**
 * POST /api/upload - Sube imágenes (admin). Requiere sesión.
 * Body: FormData con campo "files" ( múltiples archivos) o "file" (uno).
 * Respuesta: { urls: string[] } (Vercel Blob).
 * En Vercel: agregar BLOB_READ_WRITE_TOKEN (Storage → Blob).
 */
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export async function POST(request: Request) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN no configurado. Agregalo en Vercel → Storage → Blob." },
      { status: 500 }
    );
  }
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    const single = formData.get("file");
    if (single instanceof File) files.push(single);
    if (files.length === 0) {
      return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
    }
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!ALLOWED.includes(f.type)) {
        return NextResponse.json(
          { error: `Tipo no permitido: ${f.name}. Solo PNG, JPG, JPEG.` },
          { status: 400 }
        );
      }
      if (f.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Archivo demasiado grande: ${f.name}. Máx 4 MB.` },
          { status: 400 }
        );
      }
      const name = `falcon-prime/products/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const blob = await put(name, f, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      urls.push(blob.url);
    }
    return NextResponse.json({ urls });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al subir" },
      { status: 500 }
    );
  }
}
