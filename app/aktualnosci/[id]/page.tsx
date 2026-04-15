import UpdateClient from "./UpdateClient";
import { supabase } from "@/lib/supabase";

// ✅ TO JEST METADATA (SERVER)
export async function generateMetadata({ params }: { params: { id: string } }) {
    const id = params.id; // ✅ teraz OK

    const { data } = await supabase
        .from("updates")
        .select("title, content, media_url")
        .eq("id", id)
        .single();

    return {
        title: data?.title || "Aktualność",
        description: data?.content?.slice(0, 150),
        openGraph: {
            title: data?.title,
            description: data?.content?.slice(0, 150),
            images: data?.media_url ? [data.media_url] : [],
        },
    };
}

export default function Page() {
    return <UpdateClient />;
}