/**
 * POST /api/upload - Sube imágenes (admin) a Cloudinary.
 * Body: FormData con "files" (múltiples) o "file" (uno).
 * Respuesta: { urls: string[] }
 * Variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadImage, isCloudinaryConfigured, getCloudinaryError } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/png", "image/jpeg", "image/jpg"];

export async function POST(request: Request) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: getCloudinaryError() + ". Agregá CLOUDINARY_* en Vercel o .env.local." },
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
    for (const f of files) {
      if (!ALLOWED.includes(f.type)) {
        return NextResponse.json(
          { error: `Tipo no permitido: ${f.name}. Solo PNG, JPG, JPEG.` },
          { status: 400 }
        );
      }
      const url = await uploadImage(f);
      urls.push(url);
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
