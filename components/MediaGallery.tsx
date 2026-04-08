"use client";

import { useState } from "react";

interface Media {
  id: string;
  url: string;
  type: string;
  is_primary: boolean;
}

export default function MediaGallery({
  media,
  catName,
}: {
  media: Media[];
  catName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        <div className="aspect-square bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] flex items-center justify-center">
          <span
            className="material-icons opacity-50"
            style={{ fontSize: "96px", color: "var(--deep-brown)" }}
          >
            pets
          </span>
        </div>
        <div className="absolute top-6 left-6 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl flex items-center gap-2">
          <span className="material-icons">home</span>
          Do adopcji!
        </div>
      </div>
    );
  }

  const currentMedia = media[selectedIndex];

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-4">
        {currentMedia.type === "video" ? (
          <video
            src={currentMedia.url}
            controls
            className="w-full aspect-square object-cover"
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={catName}
            className="w-full aspect-square object-cover"
          />
        )}

        {/* Floating badge */}
        <div className="absolute top-6 left-6 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl flex items-center gap-2">
          <span className="material-icons">home</span>
          Do adopcji!
        </div>

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <span className="material-icons text-[var(--paw-orange)]">chevron_left</span>
            </button>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <span className="material-icons text-[var(--paw-orange)]">chevron_right</span>
            </button>
          </>
        )}

        {/* Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-[var(--paw-orange)] scale-105 shadow-lg"
                  : "border-gray-200 hover:border-[var(--warm-coral)] opacity-70 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400">play_circle</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`${catName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}