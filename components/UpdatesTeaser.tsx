"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Update {
    id: string;
    title: string;
    media_url?: string;
    created_at: string;
    type: string;
    cat_id?: string;
    cat_slug?: string;
}

export default function UpdatesTeaser() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            setIsLoading(true);

            const { data: updatesData } = await supabase
                .from("updates")
                .select("id, title, media_url, created_at, type, cat_id")
                .order("created_at", { ascending: false })
                .limit(3);

            const updatesWithCats = await Promise.all(
                (updatesData || []).map(async (update) => {
                    let cat_slug = null;

                    if (update.cat_id) {
                        const { data: catData } = await supabase
                            .from("cats")
                            .select("slug")
                            .eq("id", update.cat_id)
                            .single();

                        cat_slug = catData?.slug || null;
                    }

                    return {
                        ...update,
                        cat_slug,
                    };
                })
            );

            setUpdates(updatesWithCats);

            setUpdates(updatesWithCats);
            setIsLoading(false);
        };

        fetchUpdates();
    }, []);

    const getTypeConfig = (type: string) => {
        const configs: any = {
            news: { icon: "newspaper", color: "from-blue-400 to-blue-500" },
            success: { icon: "celebration", color: "from-green-400 to-green-500" },
            event: { icon: "event", color: "from-[var(--paw-orange)] to-[var(--warm-coral)]" },
            announcement: { icon: "campaign", color: "from-purple-400 to-purple-500" },
            new_cat: { icon: "pets", color: "from-[var(--paw-orange)] to-[var(--warm-coral)]" },
            update: { icon: "favorite", color: "from-pink-400 to-pink-500" },
            video: { icon: "play_circle", color: "from-red-400 to-red-500" },
            photo: { icon: "photo_camera", color: "from-indigo-400 to-indigo-500" },
        };
        return configs[type] || configs["news"];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Dzisiaj";
        if (diffDays === 1) return "Wczoraj";
        if (diffDays < 7) return `${diffDays} dni temu`;

        return date.toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse"
                    >
                        <div className="aspect-video bg-gray-200" />
                        <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (updates.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {updates.map((update, index) => {
                const typeConfig = getTypeConfig(update.type);
                const linkHref = update.cat_id && update.cat_slug
                    ? `/koty/${update.cat_slug}`
                    : `/aktualnosci`;

                return (
                    <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={linkHref}
                            className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            {/* Media */}
                            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-[var(--warm-cream)] to-[var(--soft-peach)]">
                                {update.media_url ? (
                                    <Image
                                        src={update.media_url}
                                        alt={update.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-icons text-gray-300 text-6xl">
                                            {typeConfig.icon}
                                        </span>
                                    </div>
                                )}

                                {/* Type badge */}
                                <div className="absolute top-3 left-3">
                                    <div
                                        className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${typeConfig.color} rounded-full shadow-lg`}
                                    >
                                        <span className="material-icons text-white text-sm">
                                            {typeConfig.icon}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className="text-xs text-[var(--soft-brown)] mb-2 flex items-center gap-1">
                                    <span className="material-icons text-xs">schedule</span>
                                    {formatDate(update.created_at)}
                                </p>
                                <h3 className="text-lg font-bold text-[var(--deep-brown)] group-hover:text-[var(--paw-orange)] transition-colors line-clamp-2">
                                    {update.title}
                                </h3>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}