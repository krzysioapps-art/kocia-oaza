"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    setUploading(true);
    const totalFiles = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      try {
        const res = await uploadToCloudinary(file, catId);
        const type = file.type.startsWith("video") ? "video" : "image";

        onUploadComplete(res.secure_url, type);

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      } catch (e) {
        console.error(e);
        alert(`Błąd uploadu pliku: ${file.name}`);
      }
    }

    setUploading(false);
    setProgress(0);

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
        accept="image/*,video/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-icons">cloud_upload</span>
        {uploading ? "Uploading..." : "Dodaj zdjęcia / wideo"}
      </button>

      {uploading && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
}