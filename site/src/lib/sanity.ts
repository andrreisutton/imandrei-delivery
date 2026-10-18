import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const STUDIO_URL = "https://andreisutton.sanity.studio";

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-06-01",
};

export const sanityEnabled = () => !!sanityConfig.projectId;

export const sanityClient = createClient({
  ...sanityConfig,
  projectId: sanityConfig.projectId || "placeholder",
  useCdn: true,
  stega: { studioUrl: STUDIO_URL },
});

type SanityImage = { asset?: { _ref?: string } } | null | undefined;

export function imageUrl(img: SanityImage): string | undefined {
  if (!img?.asset?._ref || !sanityEnabled()) return undefined;
  try {
    return imageUrlBuilder({ projectId: sanityConfig.projectId, dataset: sanityConfig.dataset })
      .image(img)
      .width(1600)
      .fit("max")
      .auto("format")
      .url();
  } catch {
    return undefined;
  }
}
