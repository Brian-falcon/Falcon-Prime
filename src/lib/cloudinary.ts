/**
 * Falcon Prime - Upload de imágenes a Cloudinary
 * Usa CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "falcon-prime/products";
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinaryError(): string {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return "CLOUDINARY_CLOUD_NAME no configurado";
  if (!process.env.CLOUDINARY_API_KEY) return "CLOUDINARY_API_KEY no configurado";
  if (!process.env.CLOUDINARY_API_SECRET) return "CLOUDINARY_API_SECRET no configurado";
  return "";
}

/**
 * Sube un archivo (File/Blob) a Cloudinary y devuelve la URL pública.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error(getCloudinaryError() + ". Agregá las variables en Vercel o .env.local.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`Archivo demasiado grande (máx 4 MB): ${file.name}`);
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: FOLDER,
          public_id: name,
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else if (result?.secure_url) resolve(result.secure_url);
          else reject(new Error("Cloudinary no devolvió URL"));
        }
      )
      .end(buffer);
  });
}
