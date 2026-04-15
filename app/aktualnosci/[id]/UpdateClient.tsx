"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UpdateClient() {
    const params = useParams();
    const id = params.id as string;

    const [update, setUpdate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isPlaying, setIsPlaying] = useState(false);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return; // 🔥 STOP jeśli brak id

        const fetchUpdate = async () => {
            const { data } = await supabase
                .from("updates")
                .select(`
                *,
                cats (
                    id,
                    name,
                    slug,
                    gender
                )
            `)
                .eq("id", id)
                .single();

            setUpdate(data);
            setIsLoading(false);
        };

        fetchUpdate();
    }, [id]);

    const getTypeConfig = (type: string) => {
        const configs: any = {
            news: {
                icon: "newspaper",
                label: "Aktualność",
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
            },
            success: {
                icon: "celebration",
                label: "Sukces",
                bgColor: "bg-green-50",
                textColor: "text-green-600",
            },
            event: {
                icon: "event",
                label: "Wydarzenie",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
            },
            announcement: {
                icon: "campaign",
                label: "Ogłoszenie",
                bgColor: "bg-purple-50",
                textColor: "text-purple-600",
            },
            new_cat: {
                icon: "pets",
                label: "Nowy kot",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
            },
            update: {
                icon: "favorite",
                label: "Aktualizacja",
                bgColor: "bg-pink-50",
                textColor: "text-pink-600",
            },
            video: {
                icon: "play_circle",
                label: "Wideo",
                bgColor: "bg-red-50",
                textColor: "text-red-600",
            },
            photo: {
                icon: "photo_camera",
                label: "Zdjęcie",
                bgColor: "bg-indigo-50",
                textColor: "text-indigo-600",
            },
        };
        return configs[type] || configs["news"];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const copyLink = () => {
        const shareUrl = `${window.location.origin}/aktualnosci/${id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--paw-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-[var(--text-medium)]">Ładowanie...</p>
                </div>
            </div>
        );
    }

    if (!update) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons text-white text-6xl">search_off</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                        Nie znaleziono wpisu
                    </h3>
                    <Link
                        href="/aktualnosci"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg transition-all"
                    >
                        <span className="material-icons">arrow_back</span>
                        <span>Powrót do aktualności</span>
                    </Link>
                </div>
            </div>
        );
    }

    const typeConfig = getTypeConfig(update.type);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-[80px] z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/aktualnosci"
                        className="inline-flex items-center gap-2 text-[var(--paw-orange)] font-semibold hover:gap-3 transition-all"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        <span>Powrót do aktualności</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <article className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Type Badge & Date */}
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${typeConfig.bgColor} ${typeConfig.textColor}`}
                        >
                            <span className="material-icons text-base">
                                {typeConfig.icon}
                            </span>
                            {typeConfig.label}
                        </span>
                        <span className="text-[var(--text-medium)] flex items-center gap-1">
                            <span className="material-icons text-sm">schedule</span>
                            {formatDate(update.created_at)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-8 leading-tight"
                        style={{ fontFamily: "'Caveat', cursive" }}
                    >
                        {update.title}
                    </h1>

                    {/* Featured Image */}
                    {update.media_url && (
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-xl">
                            {update.media_type === "video" ? (
                                <div className="relative w-full flex items-center justify-center">
                                    <video
                                        src={update.media_url}
                                        controls
                                        autoPlay
                                        muted
                                        playsInline
                                        preload="metadata"
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        className="max-h-[80vh] w-auto max-w-full object-contain"
                                    />

                                    {!isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="material-icons text-white text-6xl opacity-80">
                                                play_circle
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Image
                                    src={update.media_url}
                                    alt={update.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-12">
                        <p className="text-lg md:text-xl text-[var(--text-medium)] leading-relaxed whitespace-pre-line">
                            {update.content}
                        </p>
                    </div>

                    {/* Share Section */}
                    <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)] rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                            <span className="material-icons">share</span>
                            <span>Udostępnij tę aktualność</span>
                        </h3>
                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={copyLink}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--text-dark)] rounded-full font-semibold text-sm hover:shadow-lg transition-all border border-gray-200"
                            >
                                <span className="material-icons text-base">
                                    {copied ? "check" : "link"}
                                </span>
                                <span>
                                    {copied ? "Skopiowano!" : "Kopiuj link"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Cat Preview Card */}
                    {update.cats && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--paw-orange)] mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center">
                                    <span className="material-icons text-white text-3xl">
                                        pets
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-medium)] mb-1">
                                        Ten wpis dotyczy
                                    </p>
                                    <h3 className="text-2xl font-bold text-[var(--text-dark)]">
                                        {update.cats.name}
                                    </h3>
                                </div>
                            </div>
                            <Link
                                href={`/koty/${update.cats.slug}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg hover:gap-3 transition-all"
                            >
                                <span>Zobacz profil {update.cats.name}</span>
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-3xl p-8 text-white text-center shadow-xl">
                        <h3
                            className="text-2xl md:text-4xl font-bold mb-3"
                            style={{ fontFamily: "'Caveat', cursive" }}
                        >
                            Chcesz pomóc?
                        </h3>
                        <p className="text-lg mb-6 opacity-95">
                            Zobacz jak możesz wesprzeć nasze działania
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/koty"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--paw-orange)] rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <span className="material-icons">pets</span>
                                <span>Zobacz koty do adopcji</span>
                            </Link>
                            <Link
                                href="/jak-pomagamy"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/30 transition-all"
                            >
                                <span className="material-icons">volunteer_activism</span>
                                <span>Jak możesz pomóc</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Updates */}
            <section className="py-16 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-8 text-center"
                        style={{ fontFamily: "'Caveat', cursive" }}
                    >
                        Inne aktualności
                    </h2>
                    <div className="text-center">
                        <Link
                            href="/aktualnosci"
                            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <span>Zobacz wszystkie aktualności</span>
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}