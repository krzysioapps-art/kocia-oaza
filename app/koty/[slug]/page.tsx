import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import MediaGallery from "@/components/MediaGallery";

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

    // Fetch media for gallery
    const { data: media } = await supabase
        .from("cat_media")
        .select("*")
        .eq("cat_id", cat.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

    return (
        <div className="min-h-screen">
            {/* Back button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link 
                    href="/"
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
                        <div className="sticky top-24">
                            <MediaGallery media={media || []} catName={cat.name} />

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
                                
                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-3xl" style={{ color: 'var(--paw-orange)' }}>
                                        {cat.gender === "female" ? "favorite" : cat.gender === "male" ? "favorite" : "pets"}
                                    </span>
                                    <span className="text-xl text-[var(--soft-brown)] font-medium">
                                        {cat.gender === "female" ? "Kotka" : cat.gender === "male" ? "Kocur" : "Brak danych"}
                                    </span>
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
                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg">
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
                            </div>

                            {/* Compatibility */}
                            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl p-6 border border-[var(--warm-coral)]/20 shadow-lg">
                                <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                    <span className="material-icons">home</span>
                                    Idealne dla
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`material-icons text-2xl ${cat.good_with_children ? 'text-[var(--paw-orange)]' : 'text-gray-300'}`}>
                                            child_care
                                        </span>
                                        <span className={`font-medium ${cat.good_with_children ? 'text-[var(--deep-brown)]' : 'text-gray-400'}`}>
                                            Rodziny z dziećmi
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`material-icons text-2xl ${cat.good_with_cats ? 'text-[var(--paw-orange)]' : 'text-gray-300'}`}>
                                            pets
                                        </span>
                                        <span className={`font-medium ${cat.good_with_cats ? 'text-[var(--deep-brown)]' : 'text-gray-400'}`}>
                                            Domy z innymi kotami
                                        </span>
                                    </div>
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
                            href="/"
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