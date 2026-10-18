const YT_ID = /^[A-Za-z0-9_-]{11}$/;

export function youtubeId(input: string | undefined): string {
  const v = (input ?? "").trim();
  if (YT_ID.test(v)) return v;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//.test(v) ? v : `https://${v}`);
  } catch {
    return "";
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id = "";
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? "";
    const m = url.pathname.match(/^\/(?:shorts|live|embed|v)\/([^/?#]+)/);
    if (!id && m) id = m[1];
  }
  return YT_ID.test(id) ? id : "";
}

export function isInstagramPost(input: string | undefined): boolean {
  return /^https?:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\/[A-Za-z0-9_-]{5,40}/.test(
    (input ?? "").trim()
  );
}
