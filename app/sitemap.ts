import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://kocia-oaza.pl",
            lastModified: new Date(),
        },
        {
            url: "https://kocia-oaza.pl/jak-adoptowac",
            lastModified: new Date(),
        },
        {
            url: "https://kocia-oaza.pl/o-nas",
            lastModified: new Date(),
        },
    ];
}