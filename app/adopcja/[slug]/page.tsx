"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";

export default function AdoptionForm() {
    const params = useParams();
    const slug = params.slug as string;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [catName, setCatName] = useState("");
    const [catId, setCatId] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        housingType: "",
        hasBalcony: "",
        balconySecured: "",
        householdSize: "",
        hasChildren: "",
        childrenAges: "",
        allAgreeOnCat: "",
        timeAlone: "",
        hadCatBefore: "",
        previousCatExperience: "",
        whyAdopt: "",
    });

    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchCat = async () => {
            const { data } = await supabase
                .from("cats")
                .select("id, name")
                .eq("slug", slug)
                .single();

            if (data) {
                setCatName(data.name);
                setCatId(data.id);
            }
        };
        fetchCat();
    }, [slug]);

    useEffect(() => {
        const firstInput = formRef.current?.querySelector("input, textarea");
        if (firstInput instanceof HTMLElement) {
            firstInput.focus();
        }
    }, [currentStep]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("adoption_forms").insert([
            {
                cat_id: catId, // 🔥 TO JEST KLUCZ
                data: form,
                status: "new",
                created_at: new Date().toISOString(),
            },
        ]);

        setLoading(false);
        if (!error) {
            setSuccess(true);
        } else {
            alert("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    const updateForm = (field: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const nextStep = () => {
        setCurrentStep((prev) => prev + 1);

        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    };

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);

        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return form.name && form.email && form.phone;
            case 2:
                return (
                    form.housingType &&
                    form.hasBalcony &&
                    (form.hasBalcony === "nie" || form.balconySecured)
                );
            case 3: return form.householdSize && form.allAgreeOnCat === "tak";
            case 4: return form.timeAlone && form.hadCatBefore;
            case 5: return form.whyAdopt.length > 20;
            default: return true;
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white/80 backdrop-blur rounded-3xl p-12 shadow-2xl border border-[var(--warm-coral)]/20">
                        <span className="material-icons" style={{ fontSize: '80px', color: 'var(--paw-orange)' }}>celebration</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep-brown)] mt-6 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
                            Dziękujemy!
                        </h1>
                        <p className="text-xl text-[var(--soft-brown)] mb-8">
                            Otrzymaliśmy Twoje zgłoszenie dotyczące <span className="font-bold text-[var(--paw-orange)]">{catName}</span>.
                            Skontaktujemy się w ciągu 24-48h.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/" className="px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all">
                                Wróć do listy
                            </Link>
                            <Link href={`/${slug}`} className="px-8 py-4 bg-white border-2 border-[var(--warm-coral)] text-[var(--deep-brown)] rounded-full font-bold hover:shadow-lg transition-all">
                                Zobacz {catName}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <Link href={`/koty/${slug}`} className="inline-flex items-center gap-2 text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors font-medium mb-6 group">
                        <span className="material-icons group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span>Powrót do {catName}</span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep-brown)] mb-3" style={{ fontFamily: "'Caveat', cursive" }}>
                        Formularz adopcyjny
                    </h1>
                    <p className="text-lg text-[var(--soft-brown)]">
                        Adopcja {catName} - krok {currentStep} z 5
                    </p>
                </div>

                {/* Fixed Progress Bar */}
                <div className="mb-12">
                    <div className="relative">
                        {/* Connection lines - behind circles */}
                        <div className="absolute top-6 left-0 right-0 flex justify-between px-6" style={{ zIndex: 1 }}>
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 flex-1 mx-6 transition-all ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
                                />
                            ))}
                        </div>

                        {/* Circle steps - in front of lines */}
                        <div className="relative flex justify-between" style={{ zIndex: 2 }}>
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step < currentStep ? 'bg-green-500 text-white' :
                                        step === currentStep ? 'bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white scale-110' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                        {step < currentStep ? <span className="material-icons text-xl">check</span> : step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-[var(--soft-brown)] mt-3">
                        <span className="text-center" style={{ width: '20%' }}>Kontakt</span>
                        <span className="text-center" style={{ width: '20%' }}>Mieszkanie</span>
                        <span className="text-center" style={{ width: '20%' }}>Domownicy</span>
                        <span className="text-center" style={{ width: '20%' }}>Opieka</span>
                        <span className="text-center" style={{ width: '20%' }}>Motywacja</span>
                    </div>
                </div>

                <div ref={formRef} className="scroll-mt-24">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-[var(--warm-coral)]/20">

                            {/* STEP 1 */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                            <span className="material-icons text-3xl text-[var(--paw-orange)]">phone</span>
                                            Dane kontaktowe
                                        </h2>
                                        <p className="text-[var(--soft-brown)] mb-6">Potrzebujemy Twoich danych do kontaktu.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Imię i nazwisko *</label>
                                        <input type="text" required value={form.name} onChange={(e) => updateForm("name", e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors" placeholder="Jan Kowalski" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Email *</label>
                                        <input type="email" required value={form.email} onChange={(e) => updateForm("email", e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors" placeholder="jan@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Telefon *</label>
                                        <input type="tel" required value={form.phone} onChange={(e) => updateForm("phone", e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors" placeholder="+48 123 456 789" />
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                            <span className="material-icons text-3xl text-[var(--paw-orange)]">home</span>
                                            Twoje mieszkanie
                                        </h2>
                                        <p className="text-[var(--soft-brown)] mb-6">Chcemy upewnić się, że {catName} będzie miał bezpieczne miejsce.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Typ mieszkania *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: "dom", label: "Dom", icon: "cottage" },
                                                { value: "mieszkanie", label: "Mieszkanie", icon: "apartment" },
                                            ].map((opt) => (
                                                <button key={opt.value} type="button"
                                                    onClick={() => updateForm("housingType", opt.value)}
                                                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${form.housingType === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg scale-105" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    <span className="material-icons text-3xl mb-1">{opt.icon}</span>
                                                    <div>{opt.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Czy masz balkon/taras? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[{ value: "tak", label: "Tak" }, { value: "nie", label: "Nie" }].map((opt) => (
                                                <button key={opt.value} type="button"
                                                    onClick={() => {
                                                        updateForm("hasBalcony", opt.value);

                                                        if (opt.value === "nie") {
                                                            updateForm("balconySecured", "nie dotyczy");
                                                        } else {
                                                            updateForm("balconySecured", "");
                                                        }
                                                    }}
                                                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${form.hasBalcony === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {form.hasBalcony === "tak" && (
                                        <div className="animate-fadeIn">
                                            <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Czy balkon jest zabezpieczony? *</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { value: "tak", label: "Tak, jest zabezpieczony", icon: "verified" },
                                                    { value: "nie", label: "Nie, ale zabezpieczę", icon: "build" },
                                                ].map((opt) => (
                                                    <button key={opt.value} type="button"
                                                        onClick={() => updateForm("balconySecured", opt.value)}
                                                        className={`p-4 rounded-2xl border-2 font-medium transition-all text-left ${form.balconySecured === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                            }`}>
                                                        <span className="material-icons text-2xl mb-1">{opt.icon}</span>
                                                        <div className="text-sm">{opt.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-sm text-[var(--soft-brown)] bg-amber-50 p-3 rounded-xl flex items-start gap-2">
                                                <span className="material-icons text-amber-600">warning</span>
                                                <span>Zabezpieczenie balkonu jest obowiązkowe przed adopcją</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3 */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                            <span className="material-icons text-3xl text-[var(--paw-orange)]">family_restroom</span>
                                            Domownicy
                                        </h2>
                                        <p className="text-[var(--soft-brown)] mb-6">Poznajmy Twoją rodzinę!</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Ile osób mieszka w domu? *</label>
                                        <input type="number" min="1" required value={form.householdSize} onChange={(e) => updateForm("householdSize", e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors" placeholder="np. 3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Czy w domu są dzieci? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[{ value: "tak", label: "Tak" }, { value: "nie", label: "Nie" }].map((opt) => (
                                                <button key={opt.value} type="button"
                                                    onClick={() => updateForm("hasChildren", opt.value)}
                                                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${form.hasChildren === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {form.hasChildren === "tak" && (
                                        <div className="animate-fadeIn">
                                            <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">W jakim wieku są dzieci?</label>
                                            <input type="text" value={form.childrenAges} onChange={(e) => updateForm("childrenAges", e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors" placeholder="np. 5 lat, 8 lat" />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Czy wszyscy domownicy zgadzają się na kota? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: "tak", label: "Tak, wszyscy się cieszą!", icon: "celebration" },
                                                { value: "nie", label: "Nie wszyscy", icon: "thumb_down" },
                                            ].map((opt) => (
                                                <button key={opt.value} type="button"
                                                    onClick={() => updateForm("allAgreeOnCat", opt.value)}
                                                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${form.allAgreeOnCat === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    <span className="material-icons text-2xl mb-1">{opt.icon}</span>
                                                    <div className="text-sm">{opt.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                        {form.allAgreeOnCat === "nie" && (
                                            <p className="mt-3 text-sm text-[var(--soft-brown)] bg-amber-50 p-3 rounded-xl flex items-start gap-2">
                                                <span className="material-icons text-amber-600">warning</span>
                                                <span>Wszyscy domownicy muszą zgadzać się na adopcję</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4 */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                            <span className="material-icons text-3xl text-[var(--paw-orange)]">schedule</span>
                                            Opieka nad kotem
                                        </h2>
                                        <p className="text-[var(--soft-brown)] mb-6">Jak będzie wyglądała codzienność {catName}?</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Ile godzin dziennie kot będzie sam? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["0-2h", "2-4h", "4-6h", "6-8h", "8+h", "pracuje zdalnie"].map((opt) => (
                                                <button key={opt} type="button"
                                                    onClick={() => updateForm("timeAlone", opt)}
                                                    className={`p-3 rounded-2xl border-2 font-medium transition-all text-sm ${form.timeAlone === opt ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    {opt.replace("h", " godz.")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-3">Czy miałeś kiedyś kota? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: "tak", label: "Tak, mam doświadczenie" },
                                                { value: "nie", label: "Nie, pierwszy kot" },
                                            ].map((opt) => (
                                                <button key={opt.value} type="button"
                                                    onClick={() => updateForm("hadCatBefore", opt.value)}
                                                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${form.hadCatBefore === opt.value ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white border-transparent shadow-lg" : "border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)]"
                                                        }`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Opisz doświadczenie z kotami</label>
                                        <textarea value={form.previousCatExperience} onChange={(e) => updateForm("previousCatExperience", e.target.value)} rows={4}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors resize-none"
                                            placeholder="Jeśli miałeś kota, opowiedz o nim..." />
                                        <p className="mt-2 text-xs text-[var(--soft-brown)]">Brak doświadczenia to nie problem!</p>
                                    </div>
                                </div>
                            )}

                            {/* STEP 5 */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
                                            <span className="material-icons text-3xl text-[var(--paw-orange)]">favorite</span>
                                            Dlaczego {catName}?
                                        </h2>
                                        <p className="text-[var(--soft-brown)] mb-6">Opowiedz nam swoją historię.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">Dlaczego chcesz adoptować kota? *</label>
                                        <textarea required value={form.whyAdopt} onChange={(e) => updateForm("whyAdopt", e.target.value)} rows={8}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors resize-none"
                                            placeholder="Opowiedz swoją historię..." />
                                        <p className="mt-2 text-xs text-[var(--soft-brown)]">Minimum 20 znaków ({form.whyAdopt.length}/20)</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] p-6 rounded-2xl">
                                        <h3 className="font-bold text-[var(--deep-brown)] mb-3 flex items-center gap-2">
                                            <span className="material-icons">lightbulb</span>
                                            Podpowiedź
                                        </h3>
                                        <p className="text-sm text-[var(--soft-brown)]">Napisz szczerze - każda motywacja jest ważna!</p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex gap-4 mt-8 pt-8 border-t border-[var(--warm-coral)]/20">
                                {currentStep > 1 && (
                                    <button type="button" onClick={prevStep}
                                        className="px-6 py-3 border-2 border-[var(--warm-coral)] text-[var(--deep-brown)] rounded-full font-semibold hover:bg-[var(--soft-peach)] transition-all flex items-center gap-2">
                                        <span className="material-icons">arrow_back</span>
                                        Wstecz
                                    </button>
                                )}
                                {currentStep < 5 ? (
                                    <button type="button" onClick={nextStep} disabled={!isStepValid()}
                                        className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${isStepValid() ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white hover:shadow-xl hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}>
                                        <span>Dalej</span>
                                        <span className="material-icons">arrow_forward</span>
                                    </button>
                                ) : (
                                    <button type="submit" disabled={loading || !isStepValid()}
                                        className={`flex-1 px-6 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${loading || !isStepValid() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white hover:shadow-xl hover:scale-105"
                                            }`}>
                                        <span className="material-icons">send</span>
                                        <span>{loading ? "Wysyłanie..." : "Wyślij"}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <span className="material-icons">lock</span>
                            Twoje dane są bezpieczne
                        </h3>
                        <p className="text-sm text-blue-800">Informacje są poufne i używane tylko w procesie adopcji.</p>
                    </div>
                </div>

                <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
            </div>
        </div>
    );
}