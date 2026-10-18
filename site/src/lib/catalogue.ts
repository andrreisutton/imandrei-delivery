import { CATALOGUE_THROUGH, APPLE_ARTIST_ID, type MusicCredit } from "@/content/site";

type AppleCollection = {
  wrapperType?: string;
  collectionName?: string;
  artistName?: string;
  releaseDate?: string;
  trackCount?: number;
  collectionViewUrl?: string;
  artworkUrl100?: string;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s*-\s*(single|ep)$/i, "")
    .replace(/\s*\((feat|with)\.?[^)]*\)/gi, "")
    .replace(/[^a-z0-9]+/g, "");

function toCredit(a: AppleCollection): MusicCredit | null {
  const name = a.collectionName?.trim();
  if (!name || !a.collectionViewUrl || !a.releaseDate) return null;
  const isSingle = / - Single$/i.test(name);
  const isEp = / - EP$/i.test(name);
  const title = name.replace(/\s*-\s*(Single|EP)$/i, "");
  const feat = title.match(/\((?:feat|with)\.?\s*([^)]+)\)/i)?.[1];
  const artists = feat ? `andrei! with ${feat}` : (a.artistName ?? "andrei!").replace(/\s*&\s*/g, " with ");
  return {
    title: title.replace(/\s*\((?:feat|with)\.?[^)]*\)/i, "").trim(),
    kind: isSingle ? "Single" : isEp ? "EP" : "Album",
    artists,
    role: "Released as andrei!",
    year: a.releaseDate.slice(0, 4),
    href: a.collectionViewUrl.replace(/\?.*$/, ""),
    cover: (a.artworkUrl100 ?? "").replace(/\/\d+x\d+bb\.(jpg|png)$/, "/600x600bb.jpg"),
    platform: "apple",
  };
}

export async function withNewReleases(records: MusicCredit[]): Promise<MusicCredit[]> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${APPLE_ARTIST_ID}&entity=album&limit=200`,
      { next: { revalidate: 21600 }, signal: AbortSignal.timeout(4000) },
    );
    if (!res.ok) return records;
    const data = (await res.json()) as { results?: AppleCollection[] };
    const known = new Set(records.map((r) => norm(r.title)));
    const fresh = (data.results ?? [])
      .filter((a) => a.wrapperType === "collection" && (a.releaseDate ?? "") > `${CATALOGUE_THROUGH}T23:59:59Z`)
      .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""))
      .map(toCredit)
      .filter((c): c is MusicCredit => c !== null && !known.has(norm(c.title)));
    return fresh.length ? [...fresh, ...records] : records;
  } catch {
    return records;
  }
}
