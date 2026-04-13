"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Update {
    id: string;
    title: string;
    content: string;
    media_url?: string;
    created_at: string;
    type: "news" | "success" | "event" | "announcement";
    cat_id?: string;
    cat_name?: string;
    cat_slug?: string;
}


export default function UpdatesPage() {
    const router = useRouter();

    const [updates, setUpdates] = useState<Update[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>("all");

    useEffect(() => {
        const fetchUpdates = async () => {
            setIsLoading(true);

            const { data: updatesData } = await supabase
                .from("updates")
                .select(`
          *,
          cats (
            name,
            slug
          )
        `)
                .order("created_at", { ascending: false });

            const updatesWithCats = (updatesData || []).map((update) => ({
                ...update,
                cat_name: update.cats?.name || null,
                cat_slug: update.cats?.slug || null,
            }));

            setUpdates(updatesWithCats);
            setIsLoading(false);
        };

        fetchUpdates();
    }, []);

    const filteredUpdates =
        selectedType === "all"
            ? updates
            : updates.filter((update) => update.type === selectedType);

    const getTypeConfig = (type: string) => {
        const configs: any = {
            news: {
                icon: "newspaper",
                label: "Aktualność",
                color: "from-blue-400 to-blue-500",
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
            },
            success: {
                icon: "celebration",
                label: "Sukces",
                color: "from-green-400 to-green-500",
                bgColor: "bg-green-50",
                textColor: "text-green-600",
            },
            event: {
                icon: "event",
                label: "Wydarzenie",
                color: "from-[var(--paw-orange)] to-[var(--warm-coral)]",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
            },
            announcement: {
                icon: "campaign",
                label: "Ogłoszenie",
                color: "from-purple-400 to-purple-500",
                bgColor: "bg-purple-50",
                textColor: "text-purple-600",
            },

            // 🔥 NOWE TYPY
            new_cat: {
                icon: "pets",
                label: "Nowy kot",
                color: "from-[var(--paw-orange)] to-[var(--warm-coral)]",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
            },
            update: {
                icon: "favorite",
                label: "Aktualizacja",
                color: "from-pink-400 to-pink-500",
                bgColor: "bg-pink-50",
                textColor: "text-pink-600",
            },
            video: {
                icon: "play_circle",
                label: "Wideo",
                color: "from-red-400 to-red-500",
                bgColor: "bg-red-50",
                textColor: "text-red-600",
            },
            photo: {
                icon: "photo_camera",
                label: "Zdjęcie",
                color: "from-indigo-400 to-indigo-500",
                bgColor: "bg-indigo-50",
                textColor: "text-indigo-600",
            },
        };

        return configs[type] || configs["news"]; // 🔥 fallback
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Dzisiaj";
        if (diffDays === 1) return "Wczoraj";
        if (diffDays < 7) return `${diffDays} dni temu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;

        return date.toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const typeFilters = [
        { key: "all", label: "Wszystkie", icon: "view_list" },
        { key: "news", label: "Aktualności", icon: "newspaper" },
        { key: "success", label: "Sukcesy", icon: "celebration" },
        { key: "event", label: "Wydarzenia", icon: "event" },
        { key: "announcement", label: "Ogłoszenia", icon: "campaign" },
        { key: "new_cat", label: "Nowe koty", icon: "pets" },
        { key: "update", label: "Aktualizacje", icon: "favorite" },
        { key: "video", label: "Wideo", icon: "play_circle" },
        { key: "photo", label: "Zdjęcia", icon: "photo_camera" },
    ];

    const shareOnFacebook = (url: string) => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
            "width=600,height=400"
        );
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero Header */}
            <section className="relative bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl md:text-6xl font-bold mb-4 text-center"
                        style={{ fontFamily: "'Caveat', cursive" }}
                    >
                        Co u nas nowego
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-2xl mx-auto opacity-95">
                        Zobacz, co dzieje się u naszych podopiecznych i w stowarzyszeniu
                    </p>
                </div>
            </section>

            {/* Type Filters */}
            <section className="sticky top-[80px] z-40 bg-white shadow-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {typeFilters.map((filter) => {
                            const isActive = selectedType === filter.key;
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setSelectedType(filter.key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all text-sm ${isActive
                                        ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <span className="material-icons text-base">{filter.icon}</span>
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Updates Timeline */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="space-y-8">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
                                >
                                    <div className="md:flex">
                                        <div className="md:w-2/5 aspect-video md:aspect-square bg-gray-200" />
                                        <div className="p-6 md:w-3/5">
                                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredUpdates.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-32 h-32 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-white text-6xl">
                                    inbox
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                                Brak aktualności
                            </h3>
                            <p className="text-[var(--text-medium)] mb-6">
                                Spróbuj wybrać inną kategorię
                            </p>
                            <button
                                onClick={() => setSelectedType("all")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg transition-all"
                            >
                                <span className="material-icons">refresh</span>
                                <span>Pokaż wszystkie</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredUpdates.map((update, index) => {
                                const typeConfig = getTypeConfig(update.type);

                                return (
                                    <article
                                        key={update.id}
                                        onClick={() => router.push(`/aktualnosci/${update.id}`)}
                                        className="cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
                                        }}
                                    >

                                        <div className="md:flex">
                                            {/* Media */}
                                            {update.media_url && (
                                                <div className="md:w-2/5 relative aspect-video md:aspect-square overflow-hidden bg-gradient-to-br from-[var(--warm-cream)] to-[var(--soft-peach)]">
                                                    <Image
                                                        src={update.media_url}
                                                        alt={update.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div
                                                className={`p-6 ${update.media_url ? "md:w-3/5" : "w-full"
                                                    }`}
                                            >
                                                {/* Type Badge & Date */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${typeConfig.bgColor} ${typeConfig.textColor}`}
                                                    >
                                                        <span className="material-icons text-sm">
                                                            {typeConfig.icon}
                                                        </span>
                                                        {typeConfig.label}
                                                    </span>
                                                    <span className="text-sm text-[var(--text-medium)] flex items-center gap-1">
                                                        <span className="material-icons text-sm">
                                                            schedule
                                                        </span>
                                                        {formatDate(update.created_at)}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-3 group-hover:text-[var(--paw-orange)] transition-colors">
                                                    {update.title}
                                                </h3>

                                                {/* Content */}
                                                <p className="text-[var(--text-medium)] leading-relaxed mb-4 line-clamp-3">
                                                    {update.content}
                                                </p>

                                                {/* Cat Preview & CTA */}
                                                <div className="flex items-center gap-4 mt-4">
                                                    {update.cat_id && update.cat_slug ? (
                                                        <Link
                                                            href={`/koty/${update.cat_slug}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg hover:gap-3 transition-all"
                                                        >
                                                            <span className="material-icons text-lg">pets</span>
                                                            <span>
                                                                {update.cat_name ? `Zobacz ${update.cat_name}` : "Zobacz kota"}
                                                            </span>
                                                            <span className="material-icons text-lg">arrow_forward</span>
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href="/jak-pomagamy"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="inline-flex items-center gap-2 text-[var(--paw-orange)] font-bold hover:gap-3 transition-all"
                                                        >
                                                            <span>Dowiedz się więcej</span>
                                                            <span className="material-icons text-lg">arrow_forward</span>
                                                        </Link>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/aktualnosci/${update.id}`;
                                                            shareOnFacebook(shareUrl);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold text-sm hover:bg-blue-100 transition-all"
                                                    >
                                                        <span className="material-icons text-base">share</span>
                                                        <span>Udostępnij</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section >

            {/* CTA Section */}
            {
                !isLoading && filteredUpdates.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2
                                className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-4"
                                style={{ fontFamily: "'Caveat', cursive" }}
                            >
                                Chcesz być na bieżąco?
                            </h2>
                            <p className="text-lg md:text-xl text-[var(--text-medium)] mb-8">
                                Śledź nas w mediach społecznościowych i nie przegap żadnej
                                wiadomości
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--paw-orange)] rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all border-2 border-[var(--paw-orange)]"
                                >
                                    <span className="material-icons">facebook</span>
                                    <span>Facebook</span>
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
                                >
                                    <span className="material-icons">photo_camera</span>
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </div>
                    </section>
                )
            }

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div >
    );
}