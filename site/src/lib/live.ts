import { defineLive } from "next-sanity/live";
import { sanityClient, sanityEnabled } from "./sanity";

const token = process.env.SANITY_API_READ_TOKEN;

type Live = ReturnType<typeof defineLive>;

const stub: Pick<Live, "sanityFetch" | "SanityLive"> = {
  sanityFetch: (async () => ({ data: null, sourceMap: null, tags: [] })) as unknown as Live["sanityFetch"],
  SanityLive: (() => null) as unknown as Live["SanityLive"],
};

export const { sanityFetch, SanityLive } =
  sanityEnabled() && token
    ? defineLive({ client: sanityClient, serverToken: token, browserToken: token })
    : stub;
