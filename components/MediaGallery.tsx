"use client";

import Image from "next/image";
import { optimizeCloudinaryUrl, getBlurDataURL } from "@/lib/cloudinary";
import { useState, useRef, useEffect } from "react";


interface Media {
  id: string;
  url: string;
  media_type: "image" | "video";
  is_primary: boolean;
}

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

const PetsIcon = () => (
  <svg width="96" height="96" viewBox="0 0 24 24" fill="var(--deep-brown)" className="opacity-50">
    <path d="M4.5 9.5m0 5.5A3.5 3.5 0 1 0 4.5 8.5a3.5 3.5 0 1 0 0 7zm15 0A3.5 3.5 0 1 0 19.5 8.5a3.5 3.5 0 1 0 0 7z" />
  </svg>
);

export default function MediaGallery({
  media,
  catName,
}: {
  media: Media[];
  catName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!media || media.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        <div className="aspect-square bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] flex items-center justify-center">
          <PetsIcon />
        </div>
        <div className="absolute top-6 left-6 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl flex items-center gap-2">
          <HomeIcon />
          Do adopcji!
        </div>
      </div>
    );
  }

  const currentMedia = media[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (currentMedia.media_type !== "video") {
      videoRef.current?.pause();
    }
  }, [selectedIndex]);

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-4 bg-black flex items-center justify-center min-h-[300px] max-h-[80vh]">
        {currentMedia.media_type === "video" ? (
          <video
            ref={videoRef}
            key={currentMedia.url}
            src={optimizeCloudinaryUrl(currentMedia.url, { quality: 'auto' })}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="max-h-[80vh] max-w-full object-contain"
          />
        ) : (
          <Image
            src={optimizeCloudinaryUrl(currentMedia.url, { width: 800, height: 800, quality: 'auto', format: 'auto' })}
            alt={`${catName} - zdjęcie ${selectedIndex + 1}`}
            width={800}
            height={800}
            className="max-h-[80vh] max-w-full object-contain"
            priority={selectedIndex === 0}
            placeholder="blur"
            blurDataURL={getBlurDataURL(currentMedia.url)}
          />
        )}

        {/* Floating badge */}
        <div className="absolute top-6 left-6 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl flex items-center gap-2">
          <HomeIcon />
          Do adopcji!
        </div>

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Poprzednie zdjęcie"
            >
              <span className="text-[var(--paw-orange)]">
                <ChevronLeftIcon />
              </span>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Następne zdjęcie"
            >
              <span className="text-[var(--paw-orange)]">
                <ChevronRightIcon />
              </span>
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
              onClick={() => { setSelectedIndex(index); }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex
                ? "border-[var(--paw-orange)] scale-105 shadow-lg"
                : "border-gray-200 hover:border-[var(--warm-coral)] opacity-70 hover:opacity-100"
                }`}
              aria-label={`Przejdź do zdjęcia ${index + 1}`}
            >
              {item.media_type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={optimizeCloudinaryUrl(item.url, { quality: "auto", width: 200 })}
                    muted
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white">
                      <PlayCircleIcon />
                    </span>
                  </div>
                </div>
              ) : (
                <Image
                  src={optimizeCloudinaryUrl(item.url, { width: 150, height: 150, quality: 'auto', format: 'auto', crop: 'fill' })}
                  alt={`${catName} miniatura ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}