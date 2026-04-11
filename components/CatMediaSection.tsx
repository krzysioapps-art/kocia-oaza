import { supabase } from "@/lib/supabase";
import MediaGallery from "@/components/MediaGallery";

type Props = {
  catId: string;
  name: string;
};

export async function CatMediaSection({ catId, name }: Props) {
  const { data: media } = await supabase
    .from("cat_media")
    .select("*")
    .eq("cat_id", catId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  return <MediaGallery media={media || []} catName={name} />;
}