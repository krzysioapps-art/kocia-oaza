"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/MediaUploader";

interface Cat {
    id: string;
    name: string;
    gender: string;
    status: string;
    birth_date: string | null;
    location: string | null;
    weight: number | null;
    description: string | null;
    tags: string[] | null;
    sterilized: boolean;
    vaccinated: boolean;
    dewormed: boolean;
    fiv_status: string;
    felv_status: string;
    fip_status: string;
    good_with_cats: boolean;
    good_with_children: boolean;
    slug: string;
}

interface Media {
    id: string;
    url: string;
    type: string;
    is_primary: boolean;
}

export default function EditCatPage() {
    const router = useRouter();
    const params = useParams();
    const catId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cat, setCat] = useState<Cat | null>(null);
    const [media, setMedia] = useState<Media[]>([]);

    const [form, setForm] = useState({
        name: "",
        gender: "",
        status: "available",
        birth_date: "",
        location: "",
        weight: "",
        description: "",
        tags: [] as string[],
        sterilized: false,
        vaccinated: false,
        dewormed: false,
        fiv_status: "unknown",
        felv_status: "unknown",
        fip_status: "none",
        good_with_cats: false,
        good_with_children: false,
    });

    const availableTags = ["spokojny", "aktywny", "miziasty", "jedynak", "towarzyski", "nieśmiały"];

    useEffect(() => {
        fetchCat();
        fetchMedia();
    }, [catId]);

    const fetchCat = async () => {
        try {
            const { data, error } = await supabase
                .from("cats")
                .select("*")
                .eq("id", catId)
                .single();

            if (error) throw error;

            setCat(data);
            setForm({
                name: data.name,
                gender: data.gender,
                status: data.status,
                birth_date: data.birth_date || "",
                location: data.location || "",
                weight: data.weight?.toString() || "",
                description: data.description || "",
                tags: data.tags || [],
                sterilized: data.sterilized,
                vaccinated: data.vaccinated,
                dewormed: data.dewormed,
                fiv_status: data.fiv_status || "unknown",
                felv_status: data.felv_status || "unknown",
                fip_status: data.fip_status || "none",
                good_with_cats: data.good_with_cats,
                good_with_children: data.good_with_children,
            });
        } catch (error) {
            console.error("Error fetching cat:", error);
            alert("Błąd podczas wczytywania danych kota");
        } finally {
            setLoading(false);
        }
    };

    const fetchMedia = async () => {
        try {
            const { data, error } = await supabase
                .from("cat_media")
                .select("*")
                .eq("cat_id", catId)
                .order("is_primary", { ascending: false });

            if (error) throw error;
            setMedia(data || []);
        } catch (error) {
            console.error("Error fetching media:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("cats")
                .update({
                    name: form.name,
                    gender: form.gender,
                    status: form.status,
                    birth_date: form.birth_date || null,
                    location: form.location || null,
                    weight: form.weight ? parseFloat(form.weight) : null,
                    description: form.description || null,
                    tags: form.tags.length > 0 ? form.tags : null,
                    sterilized: form.sterilized,
                    vaccinated: form.vaccinated,
                    dewormed: form.dewormed,
                    fiv_status: form.fiv_status,
                    felv_status: form.felv_status,
                    fip_status: form.fip_status,
                    good_with_cats: form.good_with_cats,
                    good_with_children: form.good_with_children,
                })
                .eq("id", catId);

            if (error) throw error;

            alert("Zmiany zostały zapisane!");
        } catch (error) {
            console.error("Error updating cat:", error);
            alert("Błąd podczas zapisywania zmian");
        } finally {
            setSaving(false);
        }
    };

    const setPrimaryMedia = async (mediaId: string) => {
        try {
            await supabase.from("cat_media").update({ is_primary: false }).eq("cat_id", catId);
            await supabase.from("cat_media").update({ is_primary: true }).eq("id", mediaId);
            fetchMedia();
        } catch (error) {
            console.error("Error setting primary:", error);
        }
    };

    const deleteMedia = async (mediaId: string) => {
        if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;

        try {
            await supabase.from("cat_media").delete().eq("id", mediaId);
            fetchMedia();
        } catch (error) {
            console.error("Error deleting media:", error);
        }
    };

    const toggleTag = (tag: string) => {
        setForm({
            ...form,
            tags: form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag],
        });
    };

    const handleUploadComplete = async (url: string, type: "image" | "video") => {
        try {
            const isPrimary = media.length === 0;

            const { data, error } = await supabase
                .from("cat_media")
                .insert([
                    {
                        cat_id: catId,
                        url: url,
                        media_type: type,
                        is_primary: isPrimary,
                    },
                ])
                .select();

            console.log("INSERT DATA:", data);
            console.log("INSERT ERROR:", error);

            if (error) throw error;

            fetchMedia();
        } catch (error) {
            console.error("Error saving media:", error);
            alert("Błąd podczas zapisywania media");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-icons animate-spin text-6xl text-[var(--paw-orange)]">refresh</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* Media Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-icons text-[var(--paw-orange)]">photo_library</span>
                    Zdjęcia i wideo ({media.length})
                </h3>

                {/* Upload */}
                <div className="mb-6">
                    {cat && (
                        <MediaUploader
                            catId={cat.id}
                            onUploadComplete={handleUploadComplete}
                        />
                    )}
                </div>

                {media.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {media.map((item) => (
                            <div key={item.id} className="relative group">
                                {item.type === "video" ? (
                                    <video src={item.url} className="w-full h-32 object-cover rounded-lg" />
                                ) : (
                                    <img src={item.url} alt="Cat" className="w-full h-32 object-cover rounded-lg" />
                                )}
                                {item.is_primary && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                        Główne
                                    </div>
                                )}
                                {item.type === "video" && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <span className="material-icons text-xs">play_circle</span>
                                        Video
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    {!item.is_primary && (
                                        <button
                                            onClick={() => setPrimaryMedia(item.id)}
                                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                            title="Ustaw jako główne"
                                        >
                                            <span className="material-icons text-sm">star</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMedia(item.id)}
                                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                        title="Usuń"
                                    >
                                        <span className="material-icons text-sm text-red-600">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">info</span>
                        Podstawowe informacje
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Imię *</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Płeć *</label>
                            <select
                                required
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            >
                                <option value="">Wybierz płeć</option>
                                <option value="male">Kocur</option>
                                <option value="female">Kotka</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            >
                                <option value="available">Dostępny</option>
                                <option value="reserved">Zarezerwowany</option>
                                <option value="adopted">Adoptowany</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Data urodzenia</label>
                            <input
                                type="date"
                                value={form.birth_date}
                                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Lokalizacja</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Waga (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">description</span>
                        Opis
                    </h3>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">label</span>
                        Cechy charakteru
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                        {availableTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${form.tags.includes(tag)
                                    ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">medical_services</span>
                        Zdrowie
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.sterilized}
                                onChange={(e) => setForm({ ...form, sterilized: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded"
                            />
                            <span className="text-gray-700">Sterylizacja / Kastracja</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.vaccinated}
                                onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded"
                            />
                            <span className="text-gray-700">Szczepienia</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.dewormed}
                                onChange={(e) => setForm({ ...form, dewormed: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded"
                            />
                            <span className="text-gray-700">Odrobaczenie</span>
                        </label>
                    </div>
                </div>

                {/* Viral diseases */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">biotech</span>
                        Choroby wirusowe
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">

                        {/* FIV */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                FIV
                            </label>
                            <select
                                value={form.fiv_status}
                                onChange={(e) => setForm({ ...form, fiv_status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)]"
                            >
                                <option value="unknown">Brak danych</option>
                                <option value="negative">Ujemny</option>
                                <option value="positive">Dodatni</option>
                            </select>
                        </div>

                        {/* FeLV */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                FeLV
                            </label>
                            <select
                                value={form.felv_status}
                                onChange={(e) => setForm({ ...form, felv_status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)]"
                            >
                                <option value="unknown">Brak danych</option>
                                <option value="negative">Ujemny</option>
                                <option value="positive">Dodatni</option>
                            </select>
                        </div>

                        {/* FIP */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                FIP
                            </label>
                            <select
                                value={form.fip_status}
                                onChange={(e) => setForm({ ...form, fip_status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)]"
                            >
                                <option value="none">Brak</option>
                                <option value="suspected">Podejrzenie</option>
                                <option value="confirmed">Potwierdzony</option>
                                <option value="recovered">Wyleczony</option>
                            </select>
                        </div>

                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Te informacje są widoczne publicznie i pomagają w adopcji.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">group</span>
                        Relacje
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.good_with_cats}
                                onChange={(e) => setForm({ ...form, good_with_cats: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded"
                            />
                            <span className="text-gray-700">Dobrze z innymi kotami</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.good_with_children}
                                onChange={(e) => setForm({ ...form, good_with_children: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded"
                            />
                            <span className="text-gray-700">Dobrze z dziećmi</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/admin/cats"
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Anuluj
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                    </button>
                </div>
            </form>
        </div>
    );
}