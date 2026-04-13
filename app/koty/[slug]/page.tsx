import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import MediaGallery from "@/components/MediaGallery";
import { Suspense } from "react";
import { CatMediaSection } from "@/components/CatMediaSection";
import { ViralBadge } from "@/components/ViralBadge";

type CatWithMedia = {
    id: string;
    name: string;
    slug: string;
    cat_media: {
        url: string;
        is_primary: boolean;
    }[];
};

export default async function CatPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const { data: cat } = await supabase
        .from("cats")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (!cat) return notFound();

    // 🔥 GROUP LOGIC
    const { data: groupMember } = await supabase
        .from("cat_group_members")
        .select("group_id")
        .eq("cat_id", cat.id)
        .maybeSingle();

    let group: any = null;
    let groupCats: CatWithMedia[] = [];


    if (groupMember?.group_id) {
        // pobierz grupę
        const { data: groupData } = await supabase
            .from("cat_groups")
            .select("*")
            .eq("id", groupMember.group_id)
            .single();

        group = groupData;

        // pobierz członków grupy
        const { data: members } = await supabase
            .from("cat_group_members")
            .select("cat_id")
            .eq("group_id", groupMember.group_id);

        const ids = (members || []).map((m) => m.cat_id);

        let cats: CatWithMedia[] = [];

        if (ids.length > 0) {
            const { data } = await supabase
                .from("cats")
                .select(`
            id,
            name,
            slug,
            cat_media(url, is_primary)
        `)
                .in("id", ids);

            cats = data || [];
        }

        groupCats = cats.filter((c) => c.id !== cat.id);
    }

    function getAge(birthDate: string | null) {
        if (!birthDate) return "Brak danych";

        const birth = new Date(birthDate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        // < 1 rok
        if (years === 0) {
            return months <= 1 ? "1 miesiąc" : `${months} miesięcy`;
        }

        // >= 1 rok
        if (months === 0) {
            if (years === 1) return "1 rok";
            if (years < 5) return `${years} lata`;
            return `${years} lat`;
        }

        return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"} ${months} mies.`;
    }

    function getStatusLabel(status: string, gender: string | null) {
        const isFemale = gender === "female";

        switch (status) {
            case "available":
                return isFemale ? "Dostępna" : "Dostępny";
            case "reserved":
                return isFemale ? "Zarezerwowana" : "Zarezerwowany";
            case "adopted":
                return isFemale ? "Adoptowana" : "Adoptowany";
            default:
                return "Brak danych";
        }
    }

    function getCompatibilityData(
        type: "children" | "cats",
        value: boolean | null
    ) {
        if (value === true) {
            return {
                label: type === "children"
                    ? "Dla rodzin z dziećmi"
                    : "Może mieszkać z innymi kotami",
                color: "text-green-600",
                icon: "check_circle",
            };
        }

        if (value === false) {
            return {
                label: type === "children"
                    ? "Nie dla dzieci"
                    : "Najlepiej jako jedynak",
                color: "text-red-500",
                icon: "block",
            };
        }

        return {
            label: "Brak danych",
            color: "text-gray-400",
            icon: "help",
        };
    }

    return (
        <div className="min-h-screen">
            {/* Back button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link
                    href="/koty"
                    className="inline-flex items-center gap-2 text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors font-medium group"
                >
                    <span className="material-icons group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span>Powrót do listy</span>
                </Link>
            </div>

            {/* Hero section with gallery */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Left: Gallery */}
                        <div className="lg:sticky lg:top-24">
                            <Suspense
                                fallback={
                                    <div className="aspect-[3/4] w-full rounded-2xl skeleton" />
                                }
                            >
                                <CatMediaSection catId={cat.id} name={cat.name} />
                            </Suspense>

                            {/* Quick adoption CTA - Mobile */}
                            <div className="lg:hidden mt-6 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-3xl p-6 text-white shadow-xl">
                                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Caveat', cursive" }}>
                                    Chcę adoptować {cat.name}!
                                </h3>
                                <p className="mb-4 opacity-90 leading-relaxed">
                                    Wypełnij formularz adopcyjny - to tylko kilka minut.
                                </p>
                                <Link
                                    href={`/adopcja/${cat.slug}`}
                                    className="block w-full text-center bg-white text-[var(--paw-orange)] px-6 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-icons">description</span>
                                    <span>Wypełnij formularz</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div>
                            {/* Name & Gender */}
                            <div className="mb-8">
                                <h1 className="text-5xl md:text-6xl font-bold text-[var(--deep-brown)] mb-4 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                                    {cat.name}
                                </h1>

                                {group && (
                                    <div className="mt-4 inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                                        🐾 Adopcja w parze
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-[var(--paw-orange)] text-3xl">
                                        {cat.gender === "female"
                                            ? "female"
                                            : cat.gender === "male"
                                                ? "male"
                                                : "pets"}
                                    </span>
                                    <span className="text-xl text-[var(--soft-brown)] font-medium">
                                        {cat.gender === "female" ? "Kotka" : cat.gender === "male" ? "Kocur" : "Brak danych"}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg">
                                <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                    <span className="material-icons">info</span>
                                    Podstawowe informacje
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-[var(--deep-brown)]">

                                    {/* Status */}
                                    <div>
                                        <span className="text-sm text-[var(--soft-brown)]">Status</span>
                                        <p className="font-semibold">
                                            {getStatusLabel(cat.status, cat.gender)}
                                        </p>
                                    </div>

                                    {/* Lokalizacja */}
                                    <div>
                                        <span className="text-sm text-[var(--soft-brown)]">Lokalizacja</span>
                                        <p className="font-semibold">
                                            {cat.location === "kociarnia"
                                                ? "Kociarnia"
                                                : cat.location === "dt"
                                                    ? "Dom tymczasowy"
                                                    : cat.location === "ds"
                                                        ? "Dom stały"
                                                        : cat.location === "cafe"
                                                            ? "Kocia kawiarnia"
                                                            : "Brak danych"}
                                        </p>
                                    </div>

                                    {/* Wiek */}
                                    <div>
                                        <span className="text-sm text-[var(--soft-brown)]">Wiek</span>
                                        <p className="font-semibold">
                                            {getAge(cat.birth_date)}
                                        </p>
                                    </div>

                                    {/* Waga */}
                                    <div>
                                        <span className="text-sm text-[var(--soft-brown)]">Waga</span>
                                        <p className="font-semibold">
                                            {cat.weight ? `${cat.weight} kg` : "Brak danych"}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Tags */}
                            {cat.tags && cat.tags.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-[var(--soft-brown)] mb-3 uppercase tracking-wide">
                                        Charakter
                                    </h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {cat.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] text-[var(--deep-brown)] px-5 py-2.5 rounded-full font-semibold text-base border border-[var(--warm-coral)]/20"
                                            >
                                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Health info */}
                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg overflow-visible">
                                <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                    <span className="material-icons">medical_services</span>
                                    Stan zdrowia
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${cat.sterilized ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {cat.sterilized ? '✓' : '○'}
                                        </span>
                                        <span className="text-[var(--deep-brown)] font-medium">
                                            Sterylizacja/kastracja: <span className="font-bold">{cat.sterilized ? "Tak" : "Nie"}</span>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${cat.vaccinated ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {cat.vaccinated ? '✓' : '○'}
                                        </span>
                                        <span className="text-[var(--deep-brown)] font-medium">
                                            Szczepienia: <span className="font-bold">{cat.vaccinated ? "Tak" : "Nie"}</span>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${cat.dewormed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {cat.dewormed ? '✓' : '○'}
                                        </span>
                                        <span className="text-[var(--deep-brown)] font-medium">
                                            Odrobaczenie: <span className="font-bold">{cat.dewormed ? "Tak" : "Nie"}</span>
                                        </span>
                                    </li>
                                </ul>
                                {/* Viral diseases */}
                                <div className="mt-6 pt-6 border-t border-[var(--warm-coral)]/20">
                                    <h4 className="text-sm font-semibold text-[var(--soft-brown)] mb-3 uppercase tracking-wide">
                                        Choroby wirusowe
                                    </h4>

                                    <div className="flex flex-wrap gap-3 overflow-visible relative">

                                        <ViralBadge
                                            label="FIV"
                                            value={
                                                cat.fiv_status === "negative"
                                                    ? "ujemny"
                                                    : cat.fiv_status === "positive"
                                                        ? "dodatni"
                                                        : "brak danych"
                                            }
                                            color={
                                                cat.fiv_status === "negative"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : cat.fiv_status === "positive"
                                                        ? "bg-orange-100 text-orange-700 border-orange-200"
                                                        : "bg-gray-100 text-gray-500 border-gray-200"
                                            }
                                            description={
                                                <>
                                                    <p className="font-semibold mb-1">FIV (koci HIV)</p>
                                                    <p className="text-[var(--soft-brown)]">
                                                        Wirus tylko u kotów. <strong>Nie zaraża ludzi.</strong>
                                                        Koty z FIV mogą żyć długo i szczęśliwie w domu niewychodzącym.
                                                    </p>
                                                </>
                                            }
                                        />

                                        <ViralBadge
                                            label="FeLV"
                                            value={
                                                cat.felv_status === "negative"
                                                    ? "ujemny"
                                                    : cat.felv_status === "positive"
                                                        ? "dodatni"
                                                        : "brak danych"
                                            }
                                            color={
                                                cat.felv_status === "negative"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : cat.felv_status === "positive"
                                                        ? "bg-orange-100 text-orange-700 border-orange-200"
                                                        : "bg-gray-100 text-gray-500 border-gray-200"
                                            }
                                            description={
                                                <>
                                                    <p className="font-semibold mb-1">FeLV</p>
                                                    <p className="text-[var(--soft-brown)]">
                                                        Wirus białaczki kotów. <strong>Nie jest groźny dla ludzi.</strong>
                                                        Najlepiej, aby kot mieszkał bez innych kotów lub z kotami o tym samym statusie.
                                                    </p>
                                                </>
                                            }
                                        />

                                        <ViralBadge
                                            label="FIP"
                                            value={
                                                cat.fip_status === "none"
                                                    ? "brak"
                                                    : cat.fip_status === "recovered"
                                                        ? "wyleczony"
                                                        : cat.fip_status === "suspected"
                                                            ? "podejrzenie"
                                                            : cat.fip_status === "confirmed"
                                                                ? "potwierdzony"
                                                                : "brak danych"
                                            }
                                            color={
                                                cat.fip_status === "none"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : cat.fip_status === "recovered"
                                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                                        : cat.fip_status === "suspected" ||
                                                            cat.fip_status === "confirmed"
                                                            ? "bg-orange-100 text-orange-700 border-orange-200"
                                                            : "bg-gray-100 text-gray-500 border-gray-200"
                                            }
                                            description={
                                                <>
                                                    <p className="font-semibold mb-1">FIP</p>
                                                    <p className="text-[var(--soft-brown)]">
                                                        Choroba wirusowa występująca tylko u kotów — <strong>nie zaraża ludzi.</strong>
                                                        Obecnie w wielu przypadkach możliwe jest skuteczne leczenie.
                                                    </p>
                                                </>
                                            }
                                        />

                                    </div>
                                </div>
                            </div>



                            {/* Compatibility */}
                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg">
                                <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                    <span className="material-icons">home</span>
                                    Idealne dla
                                </h3>
                                <div className="space-y-3">

                                    {(() => {
                                        const data = getCompatibilityData("children", cat.good_with_children);
                                        return (
                                            <div className="flex items-center gap-3">
                                                <span className={`material-icons text-2xl ${data.color}`}>
                                                    {data.icon}
                                                </span>
                                                <span className={`font-medium ${data.color}`}>
                                                    {data.label}
                                                </span>
                                            </div>
                                        );
                                    })()}

                                    {(() => {
                                        const data = getCompatibilityData("cats", cat.good_with_cats);
                                        return (
                                            <div className="flex items-center gap-3">
                                                <span className={`material-icons text-2xl ${data.color}`}>
                                                    {data.icon}
                                                </span>
                                                <span className={`font-medium ${data.color}`}>
                                                    {data.label}
                                                </span>
                                            </div>
                                        );
                                    })()}

                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg">
                                <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                    <span className="material-icons">menu_book</span>
                                    Historia {cat.name}
                                </h3>
                                <div className="text-[var(--deep-brown)] leading-relaxed whitespace-pre-line">
                                    {cat.description || "Ta słodka duszka czeka na poznanie Ciebie i Twojej rodziny. Skontaktuj się z nami, aby dowiedzieć się więcej!"}
                                </div>
                            </div>

                            {/* ===== ADOPTION GROUP ===== */}
                            {group && groupCats.length > 0 && (
                                <div className="mb-8 bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-lg">
                                    <h3
                                        className="text-2xl font-bold text-[var(--deep-brown)] mb-3 flex items-center gap-2"
                                        style={{ fontFamily: "'Caveat', cursive" }}
                                    >
                                        <span className="material-icons">pets</span>
                                        Adopcja razem
                                    </h3>

                                    <p className="text-[var(--soft-brown)] mb-4 leading-relaxed">
                                        {group.adoption_type === "required"
                                            ? "Ten kot MUSI być adoptowany razem z:"
                                            : "Ten kot najlepiej odnajdzie się razem z:"}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {groupCats.map((c) => {
                                         const img = c.cat_media?.find((m) => m.is_primary);

                                            return (
                                                <Link
                                                    key={c.id}
                                                    href={`/${c.slug}`}
                                                    className="bg-white border border-[var(--warm-coral)]/20 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]"
                                                >
                                                    {img && (
                                                        <img
                                                            src={img.url}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )}

                                                    <div className="p-3">
                                                        <p className="font-bold text-[var(--deep-brown)] text-lg">
                                                            {c.name}
                                                        </p>
                                                        <p className="text-sm text-[var(--soft-brown)] mt-1">
                                                            Zobacz profil →
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Desktop CTA */}
                            <div className="hidden lg:block sticky bottom-6">
                                <div className="bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-3xl p-8 text-white shadow-2xl">
                                    <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Caveat', cursive" }}>
                                        Chcę adoptować {cat.name}!
                                    </h3>
                                    <p className="mb-6 opacity-90 leading-relaxed text-lg">
                                        Wypełnij formularz adopcyjny. To tylko kilka minut, a pomoże nam lepiej poznać Ciebie i Twoje warunki domowe.
                                    </p>
                                    <Link
                                        href={`/adopcja/${cat.slug}`}
                                        className="block w-full text-center bg-white text-[var(--paw-orange)] px-6 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-icons">description</span>
                                        <span>Wypełnij formularz adopcyjny</span>
                                    </Link>
                                    <p className="mt-4 text-sm opacity-75 text-center">
                                        Zwykle odpowiadamy w ciągu 24 godzin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional info section */}
            <section className="py-16 bg-gradient-to-br from-[var(--muted-mauve)] to-[var(--soft-peach)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
                            Co dalej?
                        </h2>
                        <p className="text-lg text-[var(--soft-brown)]">
                            Proces adopcji krok po kroku
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg border border-[var(--warm-coral)]/20">
                            <span className="material-icons" style={{ fontSize: '48px', color: 'var(--paw-orange)' }}>description</span>
                            <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2 mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
                                1. Formularz
                            </h3>
                            <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                                Wypełnij formularz adopcyjny - to tylko 5 minut
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg border border-[var(--warm-coral)]/20">
                            <span className="material-icons" style={{ fontSize: '48px', color: 'var(--paw-orange)' }}>chat</span>
                            <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2 mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
                                2. Rozmowa
                            </h3>
                            <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                                Porozmawiamy o Tobie i przyszłym domu dla kotka
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg border border-[var(--warm-coral)]/20">
                            <span className="material-icons" style={{ fontSize: '48px', color: 'var(--paw-orange)' }}>favorite</span>
                            <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2 mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
                                3. Nowy dom
                            </h3>
                            <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                                Podpisanie umowy i rozpoczęcie pięknej przyjaźni!
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <a
                            href="/jak-adoptowac"
                            className="inline-flex items-center gap-2 text-[var(--paw-orange)] font-semibold hover:gap-3 transition-all"
                        >
                            <span>Dowiedz się więcej o procesie adopcji</span>
                            <span className="material-icons text-sm">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Other cats section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-brown)] mb-4 flex items-center justify-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                            <span>Inne kotki czekają też!</span>
                            <span className="material-icons">pets</span>
                        </h2>
                        <p className="text-lg text-[var(--soft-brown)]">
                            Może znajdziesz jeszcze jednego przyjaciela?
                        </p>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/koty"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <span>Zobacz wszystkie koty do adopcji</span>
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}