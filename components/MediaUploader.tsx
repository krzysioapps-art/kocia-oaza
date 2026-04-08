"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

const CloudUploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
  </svg>
);

export default function MediaUploader({
  catId,
  onUploadComplete,
}: {
  catId: string;
  onUploadComplete: (url: string, type: "image" | "video") => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    const totalFiles = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      try {
        // Validate file size (max 10MB for images, 50MB for videos)
        const maxSize = file.type.startsWith("video") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error(`Plik ${file.name} jest za duży. Maksymalny rozmiar: ${maxSize / 1024 / 1024}MB`);
        }

        setCurrentFile(file.name);
        
        const res = await uploadToCloudinary(file, catId);
        const type = file.type.startsWith("video") ? "video" : "image";

        onUploadComplete(res.secure_url, type);

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : `Błąd uploadu pliku: ${file.name}`;
        console.error(errorMessage);
        setError(errorMessage);
        // Continue with other files even if one fails
      }
    }

    setUploading(false);
    setProgress(0);
    setCurrentFile("");

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Wybierz pliki do przesłania"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CloudUploadIcon />
        {uploading ? "Przesyłanie..." : "Dodaj zdjęcia / wideo"}
      </button>

      {uploading && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {progress}% - {currentFile}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Maksymalny rozmiar: 10MB dla zdjęć, 50MB dla wideo. 
        Obsługiwane formaty: JPG, PNG, WebP, MP4, MOV
      </p>
    </div>
  );
}