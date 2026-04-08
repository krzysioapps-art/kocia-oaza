"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/MediaUploader";

export default function AddCatPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<Array<{ url: string; type: "image" | "video" }>>([]);
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
        good_with_cats: false,
        good_with_children: false,
    });

    const availableTags = ["spokojny", "aktywny", "miziasty", "jedynak", "towarzyski", "nieśmiały"];

    const handleUploadComplete = (url: string, type: "image" | "video") => {
        setUploadedMedia((prev) => [...prev, { url, type }]);
    };

    const handleRemoveMedia = (index: number) => {
        setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ą/g, "a")
            .replace(/ć/g, "c")
            .replace(/ę/g, "e")
            .replace(/ł/g, "l")
            .replace(/ń/g, "n")
            .replace(/ó/g, "o")
            .replace(/ś/g, "s")
            .replace(/ź|ż/g, "z")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const slug = generateSlug(form.name);

            const { data, error } = await supabase
                .from("cats")
                .insert([
                    {
                        name: form.name,
                        slug: slug,
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
                        good_with_cats: form.good_with_cats,
                        good_with_children: form.good_with_children,
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            // Save uploaded media
            if (uploadedMedia.length > 0) {
                const mediaToInsert = uploadedMedia.map((item, index) => ({
                    cat_id: data.id,
                    url: item.url,
                    type: item.type,
                    is_primary: index === 0, // First image is primary
                }));

                await supabase.from("cat_media").insert(mediaToInsert);
            }

            alert("Kot został dodany!");
            router.push(`/admin/cats`);
        } catch (error) {
            console.error("Error adding cat:", error);
            alert("Wystąpił błąd podczas dodawania kota");
        } finally {
            setLoading(false);
        }
    };

    const toggleTag = (tag: string) => {
        setForm({
            ...form,
            tags: form.tags.includes(tag)
                ? form.tags.filter((t) => t !== tag)
                : [...form.tags, tag],
        });
    };

    return (
       <div className="max-w-5xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Media Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">photo_library</span>
                        Zdjęcia i wideo ({uploadedMedia.length})
                    </h3>

                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        Zdjęcia i wideo dodasz po zapisaniu kota, wchodząc w jego edycję.
                    </div>

                    {uploadedMedia.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {uploadedMedia.map((item, index) => (
                                <div key={index} className="relative group">
                                    {item.type === "video" ? (
                                        <video src={item.url} className="w-full h-32 object-cover rounded-lg" />
                                    ) : (
                                        <img src={item.url} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                    )}
                                    {index === 0 && (
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
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(index)}
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

                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-[var(--paw-orange)]">info</span>
                        Podstawowe informacje
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Imię *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                                placeholder="np. Mruczek"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Płeć *
                            </label>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Data urodzenia
                            </label>
                            <input
                                type="date"
                                value={form.birth_date}
                                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lokalizacja
                            </label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                                placeholder="np. Warszawa, Wola"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Waga (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
                                placeholder="np. 4.5"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
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
                        placeholder="Napisz coś o kocie..."
                    />
                </div>

                {/* Tags */}
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

                {/* Health */}
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
                                className="w-5 h-5 text-[var(--paw-orange)] rounded focus:ring-[var(--paw-orange)]"
                            />
                            <span className="text-gray-700">Sterylizacja / Kastracja</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.vaccinated}
                                onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded focus:ring-[var(--paw-orange)]"
                            />
                            <span className="text-gray-700">Szczepienia</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.dewormed}
                                onChange={(e) => setForm({ ...form, dewormed: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded focus:ring-[var(--paw-orange)]"
                            />
                            <span className="text-gray-700">Odrobaczenie</span>
                        </label>
                    </div>
                </div>

                {/* Relations */}
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
                                className="w-5 h-5 text-[var(--paw-orange)] rounded focus:ring-[var(--paw-orange)]"
                            />
                            <span className="text-gray-700">Dobrze z innymi kotami</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.good_with_children}
                                onChange={(e) => setForm({ ...form, good_with_children: e.target.checked })}
                                className="w-5 h-5 text-[var(--paw-orange)] rounded focus:ring-[var(--paw-orange)]"
                            />
                            <span className="text-gray-700">Dobrze z dziećmi</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/admin/cats"
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Anuluj
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? "Zapisywanie..." : "Dodaj kota"}
                    </button>
                </div>
            </form>
        </div>
    );
}