import { cache } from "react";
import { getCoverImages } from "./product-files";
import { draftMode } from "next/headers";
import { stegaClean } from "@sanity/client/stega";
import {
  ALL_DAWS,
  siteDefaults,
  type Credential,
  type Cta,
  type Daw,
  type EditingClient,
  type MusicCredit,
  type MusoStat,
  type MusoTrack,
  type Partner,
  type Product,
  type Retainer,
  type Session,
  type SiteContent,
  type VideoWork,
  type WorkLane,
} from "@/content/site";
import { imageUrl, sanityClient, sanityEnabled } from "./sanity";
import { sanityFetch } from "./live";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function makeHelpers(lenient: boolean) {
  const s = (v: unknown, d: string, max = 600): string => {
    if (typeof v !== "string" || !v.trim()) return d;
    return lenient ? v : v.trim().slice(0, max);
  };

  const sOpt = (v: unknown, max = 60): string | undefined => {
    if (typeof v !== "string" || !v.trim()) return undefined;
    return lenient ? v : v.trim().slice(0, max);
  };

  const n = (v: unknown, d: number, min = 0, max = 100000): number => {
    const x = typeof v === "string" ? Number(stegaClean(v)) : v;
    return typeof x === "number" && Number.isFinite(x) && x >= min && x <= max
      ? Math.round(x * 100) / 100
      : d;
  };

  const nOpt = (v: unknown, min = 0, max = 100000): number | undefined => {
    const x = typeof v === "string" ? Number(stegaClean(v)) : v;
    return typeof x === "number" && Number.isFinite(x) && x >= min && x <= max
      ? Math.round(x * 100) / 100
      : undefined;
  };

  const img = (v: unknown, d: string): string => {
    if (typeof v !== "string") return d;
    const clean = stegaClean(v);
    if (/^https:\/\/cdn\.sanity\.io\//.test(clean)) return clean;
    if (clean.startsWith("/") && !clean.includes("..")) return clean;
    return d;
  };

  const imgOpt = (v: unknown): string | undefined => {
    if (typeof v !== "string") return undefined;
    const clean = stegaClean(v);
    if (/^https:\/\/cdn\.sanity\.io\//.test(clean) || (clean.startsWith("/") && !clean.includes("..")))
      return clean;
    return undefined;
  };

  const urlOpt = (v: unknown): string | undefined => {
    if (typeof v !== "string" || !v.trim()) return undefined;
    const t = stegaClean(v).trim().slice(0, 600);
    return /^https:\/\/[^\s]+$/.test(t) ? t : undefined;
  };

  const href = (v: unknown, d: string): string => {
    if (typeof v !== "string" || !v.trim()) return d;
    const t = stegaClean(v).trim().slice(0, 300);
    return /^(https?:\/\/|\/|#|mailto:)/.test(t) ? t : d;
  };

  const cta = (v: unknown, d: Cta): Cta => {
    const o = isObj(v) ? v : {};
    return { label: s(o.label, d.label, 60), href: href(o.href, d.href) };
  };

  const strArr = (v: unknown, d: string[], maxItems = 12, maxLen = 120): string[] => {
    if (!Array.isArray(v)) return d;
    const out = v
      .filter((x): x is string => typeof x === "string" && !!x.trim())
      .map((x) => (lenient ? x : x.trim().slice(0, maxLen)))
      .slice(0, maxItems);
    return out.length ? out : d;
  };

  const key = (v: unknown): string => (typeof v === "string" ? stegaClean(v).trim() : "");

  return { s, sOpt, n, nOpt, img, imgOpt, urlOpt, href, cta, strArr, key };
}

type Helpers = ReturnType<typeof makeHelpers>;

function sanitizeProducts(
  v: unknown,
  defaults: Product[],
  defaultLinks: Record<string, string>,
  h: Helpers
): { products: Product[]; deliveryUrls: Record<string, string> } {
  if (!Array.isArray(v)) return { products: defaults, deliveryUrls: defaultLinks };
  const bySlug = new Map(defaults.map((p) => [p.slug, p]));
  const seen = new Set<string>();
  const out: Product[] = [];
  const links: Record<string, string> = {};
  for (const raw of v) {
    if (!isObj(raw)) continue;
    const slug = h.key(raw.slug);
    if (!/^[a-z0-9-]{1,96}$/.test(slug) || seen.has(slug)) continue;
    const d = bySlug.get(slug);
    const rawType = h.key(raw.type);
    const type =
      rawType === "preset" || rawType === "template" || rawType === "service"
        ? rawType
        : d?.type;
    if (!type) continue;
    seen.add(slug);
    const price = h.n(raw.price, d?.price ?? 0);
    const compareAt = h.nOpt(raw.compareAtPrice);
    const badge = h.sOpt(raw.badge, 24);
    const image = h.imgOpt(raw.image);
    const gradeBefore = h.imgOpt(raw.gradeBefore) ?? d?.gradeBefore;
    const gradeAfter = h.imgOpt(raw.gradeAfter) ?? d?.gradeAfter;
    const deliveryUrl = h.urlOpt(raw.deliveryUrl) ?? defaultLinks[slug];
    if (deliveryUrl) links[slug] = deliveryUrl;
    const rawDaw = h.key(raw.daw) as Daw;
    const daw = ALL_DAWS.includes(rawDaw) ? rawDaw : d?.daw;
    out.push({
      slug,
      type,
      ...(daw ? { daw } : {}),
      title: h.s(raw.title, d?.title ?? "Untitled", 80),
      subtitle: h.s(raw.subtitle, d?.subtitle ?? "", 80),
      description: h.s(raw.description, d?.description ?? "", 1500),
      includes: h.strArr(raw.includes, d?.includes ?? []),
      price,
      ...(compareAt && compareAt > price ? { compareAtPrice: compareAt } : {}),
      ...(badge ? { badge } : {}),
      coverHue: h.n(raw.coverHue, d?.coverHue ?? 25, 0, 360),
      ...(image ? { image } : {}),
      ...(d?.fileName ? { fileName: d.fileName } : {}),
      ...(d?.showGradeCompare ? { showGradeCompare: true } : {}),
      ...(d?.compare ? { compare: d.compare } : {}),
      ...(gradeBefore && gradeAfter
        ? {
            gradeBefore,
            gradeAfter,
            ...(d?.gradeCaption ? { gradeCaption: d.gradeCaption } : {}),
            ...(d?.gradeCaptionHref ? { gradeCaptionHref: d.gradeCaptionHref } : {}),
          }
        : {}),
      ...(d?.audioBefore && d?.audioAfter
        ? {
            audioBefore: d.audioBefore,
            audioAfter: d.audioAfter,
            ...(d?.audioCaption ? { audioCaption: d.audioCaption } : {}),
          }
        : {}),
      ...(raw.soldOut === true ? { soldOut: true } : {}),
    });
  }
  return out.length
    ? { products: out, deliveryUrls: links }
    : { products: defaults, deliveryUrls: defaultLinks };
}

function sanitizeSessions(v: unknown, defaults: Session[], h: Helpers): Session[] {
  if (!Array.isArray(v)) return defaults;
  const byId = new Map(defaults.map((x) => [x.id, x]));
  const seen = new Set<string>();
  const out: Session[] = [];
  for (const raw of v) {
    if (!isObj(raw)) continue;
    const id = h.key(raw.id);
    if (!/^[a-z0-9-]{1,96}$/.test(id) || seen.has(id)) continue;
    const d = byId.get(id);
    seen.add(id);
    out.push({
      id,
      title: h.s(raw.title, d?.title ?? "Session", 80),
      duration: h.s(raw.duration, d?.duration ?? "", 40),
      price: h.n(raw.price, d?.price ?? 0),
      description: h.s(raw.description, d?.description ?? "", 600),
    });
  }
  return out.length ? out : defaults;
}

function sanitizeCredentials(v: unknown, defaults: Credential[], h: Helpers): Credential[] {
  if (!Array.isArray(v)) return defaults;
  const out: Credential[] = [];
  for (const raw of v.slice(0, 32)) {
    if (!isObj(raw)) continue;
    const name = h.s(raw.name, "", 60);
    if (!name) continue;
    const videoUrl = h.urlOpt(raw.videoUrl);
    const avatar = h.imgOpt(raw.avatar);
    const instagram = h.urlOpt(raw.instagram);
    out.push({
      name,
      role: h.s(raw.role, "", 120),
      ...(videoUrl ? { videoUrl } : {}),
      ...(avatar ? { avatar } : {}),
      ...(instagram ? { instagram } : {}),
    });
  }
  return out;
}

const LANES: WorkLane[] = ["color", "video", "photo", "music"];

function sanitizeVideoWork(v: unknown, defaults: VideoWork[], h: Helpers): VideoWork[] {
  if (!Array.isArray(v)) return defaults;
  const byId = new Map(defaults.map((x) => [x.videoId, x]));
  const out: VideoWork[] = [];
  for (const raw of v.slice(0, 48)) {
    if (!isObj(raw)) continue;
    const videoId = h.key(raw.videoId);
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) continue;
    const d = byId.get(videoId);
    const lane = h.key(raw.lane) as WorkLane;
    out.push({
      videoId,
      title: h.s(raw.title, "Untitled", 120),
      credit: h.s(raw.credit, "", 160),
      year: h.s(raw.year, "", 12),
      ...(LANES.includes(lane) ? { lane } : d?.lane ? { lane: d.lane } : {}),
      ...(d?.local ? { local: d.local } : {}),
    });
  }
  return out;
}

function sanitizeEditingClients(v: unknown, defaults: EditingClient[], h: Helpers): EditingClient[] {
  if (!Array.isArray(v)) return defaults;
  const out: EditingClient[] = [];
  for (const raw of v.slice(0, 8)) {
    if (!isObj(raw)) continue;
    const name = h.s(raw.name, "", 80);
    const note = h.s(raw.note, "", 200);
    if (!name && !note) continue;
    const href = h.urlOpt(raw.href);
    const links = Array.isArray(raw.links)
      ? raw.links
          .filter(isObj)
          .map((l) => {
            const label = h.s(l.label, "", 60);
            const linkHref = h.urlOpt(l.href);
            if (!label || !linkHref) return null;
            const banner = h.imgOpt(l.banner);
            const avatar = h.imgOpt(l.avatar);
            const handle = h.sOpt(l.handle, 40);
            const subscribers = h.sOpt(l.subscribers, 40);
            const videos = h.sOpt(l.videos, 40);
            const description = h.sOpt(l.description, 160);
            return {
              label,
              href: linkHref,
              ...(banner ? { banner } : {}),
              ...(avatar ? { avatar } : {}),
              ...(handle ? { handle } : {}),
              ...(subscribers ? { subscribers } : {}),
              ...(videos ? { videos } : {}),
              ...(description ? { description } : {}),
            };
          })
          .filter((l): l is NonNullable<typeof l> => l !== null)
          .slice(0, 4)
      : [];
    out.push({
      name,
      role: h.s(raw.role, "", 120),
      note,
      ...(href ? { href } : {}),
      ...(links.length ? { links } : {}),
    });
  }
  return out.length ? out : defaults;
}

function sanitizeMusicCredits(v: unknown, defaults: MusicCredit[], h: Helpers): MusicCredit[] {
  if (!Array.isArray(v)) return defaults;
  const out: MusicCredit[] = [];
  for (const raw of v.slice(0, 64)) {
    if (!isObj(raw)) continue;
    const title = h.s(raw.title, "", 80);
    const href = h.urlOpt(raw.href);
    if (!title || !href) continue;
    out.push({
      title,
      kind: h.s(raw.kind, "", 24),
      artists: h.s(raw.artists, "", 160),
      role: h.s(raw.role, "", 160),
      year: h.s(raw.year, "", 12),
      href,
      cover: h.imgOpt(raw.cover) ?? "",
    });
  }
  return out;
}

function sanitizePartners(v: unknown, defaults: Partner[], h: Helpers): Partner[] {
  if (!Array.isArray(v)) return defaults;
  const out: Partner[] = [];
  for (const raw of v.slice(0, 16)) {
    if (!isObj(raw)) continue;
    const name = h.s(raw.name, "", 60);
    const href = h.urlOpt(raw.href);
    if (!name || !href) continue;
    const code = h.key(raw.code).slice(0, 40);
    out.push({
      name,
      what: h.s(raw.what, "", 160),
      code,
      perk: h.s(raw.perk, "", 120),
      href,
      ...(raw.referral === true ? { referral: true } : {}),
    });
  }
  return out;
}

function sanitizeMusoStats(v: unknown, d: MusoStat[], h: Helpers): MusoStat[] {
  if (!Array.isArray(v)) return d;
  const out: MusoStat[] = [];
  for (const raw of v.slice(0, 6)) {
    if (!isObj(raw)) continue;
    const value = h.s(raw.value, "", 12);
    const label = h.s(raw.label, "", 30);
    if (value && label) out.push({ value, label });
  }
  return out.length ? out : d;
}

function sanitizeMusoTracks(v: unknown, d: MusoTrack[], h: Helpers): MusoTrack[] {
  if (!Array.isArray(v)) return d;
  const out: MusoTrack[] = [];
  for (const raw of v.slice(0, 5)) {
    if (!isObj(raw)) continue;
    const title = h.s(raw.title, "", 80);
    const href = h.urlOpt(raw.href);
    if (!title || !href) continue;
    out.push({
      title,
      artists: h.s(raw.artists, "", 120),
      streams: h.s(raw.streams, "", 20),
      href,
      cover: h.imgOpt(raw.cover) ?? "",
    });
  }
  return out.length ? out : d;
}

function sanitizeRetainers(v: unknown, defaults: Retainer[], h: Helpers): Retainer[] {
  if (!Array.isArray(v)) return defaults;
  const byId = new Map(defaults.map((x) => [x.id, x]));
  const seen = new Set<string>();
  const out: Retainer[] = [];
  for (const raw of v.slice(0, 8)) {
    if (!isObj(raw)) continue;
    const id = h.key(raw.id);
    if (!/^[a-z0-9-]{1,96}$/.test(id) || seen.has(id)) continue;
    const d = byId.get(id);
    seen.add(id);
    const badge = h.sOpt(raw.badge, 24);
    out.push({
      id,
      title: h.s(raw.title, d?.title ?? "Retainer", 60),
      volume: h.s(raw.volume, d?.volume ?? "", 80),
      price: h.n(raw.price, d?.price ?? 0),
      description: h.s(raw.description, d?.description ?? "", 600),
      includes: h.strArr(raw.includes, d?.includes ?? []),
      ...(badge ? { badge } : {}),
    });
  }
  return out.length ? out : defaults;
}

function sanitizeSocials(
  v: unknown,
  defaults: SiteContent["socials"],
  h: Helpers
): SiteContent["socials"] {
  if (!Array.isArray(v)) return defaults;
  const out: SiteContent["socials"] = [];
  for (const raw of v.slice(0, 8)) {
    if (!isObj(raw)) continue;
    const label = h.key(raw.label).slice(0, 40);
    const url = typeof raw.href === "string" && /^https?:\/\//.test(stegaClean(raw.href).trim());
    if (!label || !url) continue;
    out.push({ label, href: stegaClean(raw.href as string).trim().slice(0, 300) });
  }
  return out;
}

export function sanitizeContent(
  raw: unknown,
  d: SiteContent = siteDefaults,
  opts: { lenient?: boolean } = {}
): SiteContent {
  const h = makeHelpers(!!opts.lenient);
  const r = isObj(raw) ? raw : {};
  const brand = isObj(r.brand) ? r.brand : {};
  const home = isObj(r.home) ? r.home : {};
  const hero = isObj(home.hero) ? home.hero : {};
  const serviceBlock = isObj(home.serviceBlock) ? home.serviceBlock : {};
  const pages = isObj(r.pages) ? r.pages : {};
  const pg = (k: keyof SiteContent["pages"]) => (isObj(pages[k]) ? (pages[k] as Record<string, unknown>) : {});
  const checkoutCopy = isObj(r.checkoutCopy) ? r.checkoutCopy : {};
  const industry = isObj(r.industry) ? r.industry : {};
  const reach = isObj(industry.reach) ? industry.reach : {};
  const muso = isObj(industry.muso) ? industry.muso : {};
  const colorBand = isObj(home.colorBand) ? home.colorBand : {};
  const photoBand = isObj(home.photoBand) ? home.photoBand : {};
  const musoBand = isObj(home.musoBand) ? home.musoBand : {};
  const mixDemo = isObj(pg("mixing").demo) ? (pg("mixing").demo as Record<string, unknown>) : {};
  const workLanesRaw = isObj(pg("work").lanes) ? (pg("work").lanes as Record<string, unknown>) : {};
  const workLanes = {
    color: isObj(workLanesRaw.color) ? (workLanesRaw.color as Record<string, unknown>) : {},
    video: isObj(workLanesRaw.video) ? (workLanesRaw.video as Record<string, unknown>) : {},
    photo: isObj(workLanesRaw.photo) ? (workLanesRaw.photo as Record<string, unknown>) : {},
    sports: isObj(workLanesRaw.sports) ? (workLanesRaw.sports as Record<string, unknown>) : {},
    design: isObj(workLanesRaw.design) ? (workLanesRaw.design as Record<string, unknown>) : {},
    music: isObj(workLanesRaw.music) ? (workLanesRaw.music as Record<string, unknown>) : {},
  };

  const email = stegaClean(typeof brand.email === "string" ? brand.email : "").trim();
  const catalog = sanitizeProducts(r.products, d.products, d.deliveryUrls, h);
  return {
    brand: {
      name: h.s(brand.name, d.brand.name, 60),
      shortName: h.s(brand.shortName, d.brand.shortName, 30),
      tagline: h.s(brand.tagline, d.brand.tagline, 200),
      description: h.s(brand.description, d.brand.description, 400),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : d.brand.email,
      logo: h.img(brand.logo, d.brand.logo),
      logoDark: h.img(brand.logoDark, d.brand.logoDark),
    },
    socials: sanitizeSocials(r.socials, d.socials, h),
    credentials: sanitizeCredentials(r.credentials, d.credentials, h),
    videoWork: sanitizeVideoWork(r.videoWork, d.videoWork, h),
    industry: {
      musoUrl: h.urlOpt(industry.musoUrl) ?? d.industry.musoUrl,
      musoLabel: h.s(industry.musoLabel, d.industry.musoLabel, 80),
      muso: {
        statsNote: h.s(muso.statsNote, d.industry.muso.statsNote, 120),
        stats: sanitizeMusoStats(muso.stats, d.industry.muso.stats, h),
        rolesNote: h.s(muso.rolesNote, d.industry.muso.rolesNote, 120),
        roles: sanitizeMusoStats(muso.roles, d.industry.muso.roles, h),
        chart: h.s(muso.chart, d.industry.muso.chart, 160),
        topHeading: h.s(muso.topHeading, d.industry.muso.topHeading, 60),
        top: sanitizeMusoTracks(muso.top, d.industry.muso.top, h),
      },
      reach: {
        value: h.s(reach.value, d.industry.reach.value, 12),
        label: h.s(reach.label, d.industry.reach.label, 80),
      },
      editingClients: sanitizeEditingClients(industry.editingClients, d.industry.editingClients, h),
    },
    musicCredits: sanitizeMusicCredits(r.musicCredits, d.musicCredits, h),
    collaborators: sanitizeCredentials(r.collaborators, d.collaborators, h),
    partners: sanitizePartners(r.partners, d.partners, h),
    products: catalog.products,
    deliveryUrls: catalog.deliveryUrls,
    sessions: sanitizeSessions(r.sessions, d.sessions, h),
    retainers: sanitizeRetainers(r.retainers, d.retainers, h),
    home: {
      hero: {
        eyebrow: h.s(hero.eyebrow, d.home.hero.eyebrow, 100),
        headline: h.s(hero.headline, d.home.hero.headline, 120),
        sub: h.s(hero.sub, d.home.hero.sub, 300),
        primaryCta: h.cta(hero.primaryCta, d.home.hero.primaryCta),
        secondaryCta: h.cta(hero.secondaryCta, d.home.hero.secondaryCta),
      },
      trustedHeading: h.s(home.trustedHeading, d.home.trustedHeading, 80),
      daws: h.strArr(home.daws, d.home.daws, 10, 40),
      builtForLabel: h.s(home.builtForLabel, d.home.builtForLabel, 40),
      featuredHeading: h.s(home.featuredHeading, d.home.featuredHeading, 80),
      viewAllLabel: h.s(home.viewAllLabel, d.home.viewAllLabel, 40),
      colorBand: {
        heading: h.s(colorBand.heading, d.home.colorBand.heading, 100),
        body: h.s(colorBand.body, d.home.colorBand.body, 500),
        cta: h.cta(colorBand.cta, d.home.colorBand.cta),
      },
      photoBand: {
        heading: h.s(photoBand.heading, d.home.photoBand.heading, 100),
        body: h.s(photoBand.body, d.home.photoBand.body, 300),
      },
      musoBand: {
        heading: h.s(musoBand.heading, d.home.musoBand.heading, 100),
        body: h.s(musoBand.body, d.home.musoBand.body, 300),
      },
      stepsHeading: h.s(home.stepsHeading, d.home.stepsHeading, 80),
      steps: Array.isArray(home.steps)
        ? d.home.steps.map((ds, i) => {
            const rs = isObj((home.steps as unknown[])[i]) ? ((home.steps as unknown[])[i] as Record<string, unknown>) : {};
            return { title: h.s(rs.title, ds.title, 60), body: h.s(rs.body, ds.body, 300) };
          })
        : d.home.steps,
      serviceBlock: {
        headline: h.s(serviceBlock.headline, d.home.serviceBlock.headline, 100),
        body: h.s(serviceBlock.body, d.home.serviceBlock.body, 400),
        cta: h.cta(serviceBlock.cta, d.home.serviceBlock.cta),
      },
      reviewsHeading: h.s(home.reviewsHeading, d.home.reviewsHeading, 80),
      allReviewsLabel: h.s(home.allReviewsLabel, d.home.allReviewsLabel, 40),
      finalHeading: h.s(home.finalHeading, d.home.finalHeading, 120),
      marqueeHeading: h.s(home.marqueeHeading, d.home.marqueeHeading, 80),
      marqueeNote: h.s(home.marqueeNote, d.home.marqueeNote, 160),
      marqueeCta: h.s(home.marqueeCta, d.home.marqueeCta, 40),
      finalCta: h.cta(home.finalCta, d.home.finalCta),
    },
    pages: {
      presets: {
        heading: h.s(pg("presets").heading, d.pages.presets.heading, 80),
        intro: h.s(pg("presets").intro, d.pages.presets.intro, 400),
      },
      product: {
        buyLabel: h.s(pg("product").buyLabel, d.pages.product.buyLabel, 40),
        instantLine: h.s(pg("product").instantLine, d.pages.product.instantLine, 60),
        emailLine: h.s(pg("product").emailLine, d.pages.product.emailLine, 60),
        insideHeading: h.s(pg("product").insideHeading, d.pages.product.insideHeading, 60),
        compareHeading: h.s(pg("product").compareHeading, d.pages.product.compareHeading, 60),
        compareBefore: h.s(pg("product").compareBefore, d.pages.product.compareBefore, 20),
        compareAfter: h.s(pg("product").compareAfter, d.pages.product.compareAfter, 20),
      },
      services: {
        heading: h.s(pg("services").heading, d.pages.services.heading, 80),
        intro: h.s(pg("services").intro, d.pages.services.intro, 400),
        outro: h.s(pg("services").outro, d.pages.services.outro, 300),
      },
      editing: {
        heading: h.s(pg("editing").heading, d.pages.editing.heading, 80),
        intro: h.s(pg("editing").intro, d.pages.editing.intro, 400),
        tiersHeading: h.s(pg("editing").tiersHeading, d.pages.editing.tiersHeading, 80),
        bookLabel: h.s(pg("editing").bookLabel, d.pages.editing.bookLabel, 40),
        formHeading: h.s(pg("editing").formHeading, d.pages.editing.formHeading, 80),
        formIntro: h.s(pg("editing").formIntro, d.pages.editing.formIntro, 400),
        payNote: h.s(pg("editing").payNote, d.pages.editing.payNote, 300),
      },
      work: {
        heading: h.s(pg("work").heading, d.pages.work.heading, 80),
        intro: h.s(pg("work").intro, d.pages.work.intro, 400),
        lanes: {
          color: {
            heading: h.s(workLanes.color?.heading, d.pages.work.lanes.color.heading, 60),
            note: h.s(workLanes.color?.note, d.pages.work.lanes.color.note, 200),
          },
          video: {
            heading: h.s(workLanes.video?.heading, d.pages.work.lanes.video.heading, 60),
            note: h.s(workLanes.video?.note, d.pages.work.lanes.video.note, 200),
          },
          photo: {
            heading: h.s(workLanes.photo?.heading, d.pages.work.lanes.photo.heading, 60),
            note: h.s(workLanes.photo?.note, d.pages.work.lanes.photo.note, 200),
          },
          sports: {
            heading: h.s(workLanes.sports?.heading, d.pages.work.lanes.sports.heading, 60),
            note: h.s(workLanes.sports?.note, d.pages.work.lanes.sports.note, 200),
          },
          design: {
            heading: h.s(workLanes.design?.heading, d.pages.work.lanes.design.heading, 60),
            note: h.s(workLanes.design?.note, d.pages.work.lanes.design.note, 200),
          },
          music: {
            heading: h.s(workLanes.music?.heading, d.pages.work.lanes.music.heading, 60),
            note: h.s(workLanes.music?.note, d.pages.work.lanes.music.note, 200),
          },
        },
        reelsNote: h.s(pg("work").reelsNote, d.pages.work.reelsNote, 120),
        recordsNote: h.s(pg("work").recordsNote, d.pages.work.recordsNote, 120),
        listenNote: h.s(pg("work").listenNote, d.pages.work.listenNote, 120),
        igHeading: h.s(pg("work").igHeading, d.pages.work.igHeading, 80),
        igNote: h.s(pg("work").igNote, d.pages.work.igNote, 160),
        emptyLane: h.s(pg("work").emptyLane, d.pages.work.emptyLane, 120),
      },
      credits: {
        heading: h.s(pg("credits").heading, d.pages.credits.heading, 80),
        intro: h.s(pg("credits").intro, d.pages.credits.intro, 400),
        workHeading: h.s(pg("credits").workHeading, d.pages.credits.workHeading, 80),
        musicHeading: h.s(pg("credits").musicHeading, d.pages.credits.musicHeading, 80),
        musicIntro: h.s(pg("credits").musicIntro, d.pages.credits.musicIntro, 400),
        recordsHeading: h.s(pg("credits").recordsHeading, d.pages.credits.recordsHeading, 80),
        collabHeading: h.s(pg("credits").collabHeading, d.pages.credits.collabHeading, 80),
        collabMoreHeading: h.s(pg("credits").collabMoreHeading, d.pages.credits.collabMoreHeading, 80),
        editingHeading: h.s(pg("credits").editingHeading, d.pages.credits.editingHeading, 80),
      },
      partners: {
        heading: h.s(pg("partners").heading, d.pages.partners.heading, 80),
        intro: h.s(pg("partners").intro, d.pages.partners.intro, 400),
        codeLabel: h.s(pg("partners").codeLabel, d.pages.partners.codeLabel, 30),
        copyLabel: h.s(pg("partners").copyLabel, d.pages.partners.copyLabel, 30),
        copiedLabel: h.s(pg("partners").copiedLabel, d.pages.partners.copiedLabel, 30),
        visitLabel: h.s(pg("partners").visitLabel, d.pages.partners.visitLabel, 30),
        referralLabel: h.s(pg("partners").referralLabel, d.pages.partners.referralLabel, 30),
        outro: h.s(pg("partners").outro, d.pages.partners.outro, 300),
      },
      mixing: {
        heading: h.s(pg("mixing").heading, d.pages.mixing.heading, 80),
        intro: h.s(pg("mixing").intro, d.pages.mixing.intro, 400),
        ctaLabel: h.s(pg("mixing").ctaLabel, d.pages.mixing.ctaLabel, 40),
        tiersHeading: h.s(pg("mixing").tiersHeading, d.pages.mixing.tiersHeading, 80),
        bookLabel: h.s(pg("mixing").bookLabel, d.pages.mixing.bookLabel, 40),
        payNote: h.s(pg("mixing").payNote, d.pages.mixing.payNote, 300),
        formHeading: h.s(pg("mixing").formHeading, d.pages.mixing.formHeading, 80),
        formIntro: h.s(pg("mixing").formIntro, d.pages.mixing.formIntro, 400),
        demoHeading: h.s(pg("mixing").demoHeading, d.pages.mixing.demoHeading, 80),
        demoNote: h.s(pg("mixing").demoNote, d.pages.mixing.demoNote, 200),
        demo: {
          title: h.s(mixDemo.title, d.pages.mixing.demo.title, 120),
          credit: h.s(mixDemo.credit, d.pages.mixing.demo.credit, 160),
          beforeSrc: h.s(mixDemo.beforeSrc, d.pages.mixing.demo.beforeSrc, 400),
          afterSrc: h.s(mixDemo.afterSrc, d.pages.mixing.demo.afterSrc, 400),
          beforeLabel: h.s(mixDemo.beforeLabel, d.pages.mixing.demo.beforeLabel, 24),
          afterLabel: h.s(mixDemo.afterLabel, d.pages.mixing.demo.afterLabel, 24),
        },
      },
      photoVideo: {
        heading: h.s(pg("photoVideo").heading, d.pages.photoVideo.heading, 80),
        intro: h.s(pg("photoVideo").intro, d.pages.photoVideo.intro, 400),
        ctaLabel: h.s(pg("photoVideo").ctaLabel, d.pages.photoVideo.ctaLabel, 40),
        tiersHeading: h.s(pg("photoVideo").tiersHeading, d.pages.photoVideo.tiersHeading, 80),
        bookLabel: h.s(pg("photoVideo").bookLabel, d.pages.photoVideo.bookLabel, 40),
        payNote: h.s(pg("photoVideo").payNote, d.pages.photoVideo.payNote, 300),
        formHeading: h.s(pg("photoVideo").formHeading, d.pages.photoVideo.formHeading, 80),
        formIntro: h.s(pg("photoVideo").formIntro, d.pages.photoVideo.formIntro, 400),
      },
      book: {
        heading: h.s(pg("book").heading, d.pages.book.heading, 80),
        intro: h.s(pg("book").intro, d.pages.book.intro, 400),
      },
      reviews: {
        heading: h.s(pg("reviews").heading, d.pages.reviews.heading, 80),
        intro: h.s(pg("reviews").intro, d.pages.reviews.intro, 400),
      },
      about: {
        heading: h.s(pg("about").heading, d.pages.about.heading, 80),
        paragraphs: h.strArr(pg("about").paragraphs, d.pages.about.paragraphs, 8, 1500),
      },
    },
    checkoutCopy: {
      demoNote: h.s(checkoutCopy.demoNote, d.checkoutCopy.demoNote, 300),
    },
  };
}

const QUERY = `{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0],
  "pages": *[_id == "pagesCopy"][0],
  "catalog": *[_id == "catalog"][0],
  "credits": *[_id == "credits"][0],
  "partners": *[_id == "partners"][0]
}`;

type RawDocs = {
  settings?: Record<string, unknown> | null;
  home?: Record<string, unknown> | null;
  pages?: Record<string, unknown> | null;
  catalog?: Record<string, unknown> | null;
  credits?: Record<string, unknown> | null;
  partners?: Record<string, unknown> | null;
};

type SanityImage = { asset?: { _ref?: string } } | null | undefined;

function mapDocs(docs: RawDocs): Record<string, unknown> {
  const settings = docs.settings ?? {};
  const catalog = docs.catalog ?? {};
  const products = Array.isArray((catalog as Record<string, unknown>).products)
    ? ((catalog as Record<string, unknown>).products as Record<string, unknown>[]).map((p) => ({
        ...p,
        slug: isObj(p.slug) ? (p.slug as Record<string, unknown>).current : p.slug,
        image: imageUrl(p.image as SanityImage),
        gradeBefore: imageUrl(p.gradeBefore as SanityImage),
        gradeAfter: imageUrl(p.gradeAfter as SanityImage),
      }))
    : undefined;
  const retainers = Array.isArray((catalog as Record<string, unknown>).retainers)
    ? ((catalog as Record<string, unknown>).retainers as Record<string, unknown>[]).map((x) => ({
        ...x,
        id: isObj(x.id) ? (x.id as Record<string, unknown>).current : x.id,
      }))
    : undefined;
  const credits = docs.credits ?? {};
  const musicCredits = Array.isArray((credits as Record<string, unknown>).musicCredits)
    ? ((credits as Record<string, unknown>).musicCredits as Record<string, unknown>[]).map((m) => ({
        ...m,
        cover: imageUrl(m.cover as SanityImage),
      }))
    : undefined;
  const partnersDoc = docs.partners ?? {};
  const brand = isObj((settings as Record<string, unknown>).brand)
    ? ((settings as Record<string, unknown>).brand as Record<string, unknown>)
    : undefined;
  const sessions = Array.isArray((catalog as Record<string, unknown>).sessions)
    ? ((catalog as Record<string, unknown>).sessions as Record<string, unknown>[]).map((x) => ({
        ...x,
        id: isObj(x.id) ? (x.id as Record<string, unknown>).current : x.id,
      }))
    : undefined;
  return {
    brand: brand
      ? {
          ...brand,
          logo: imageUrl(brand.logo as SanityImage),
          logoDark: imageUrl(brand.logoDark as SanityImage),
        }
      : undefined,
    socials: (settings as Record<string, unknown>).socials,
    checkoutCopy: { demoNote: (settings as Record<string, unknown>).checkoutDemoNote },
    home: docs.home ?? undefined,
    pages: docs.pages ?? undefined,
    products,
    sessions,
    retainers,
    credentials: (credits as Record<string, unknown>).credentials,
    videoWork: (credits as Record<string, unknown>).videoWork,
    industry: (credits as Record<string, unknown>).industry,
    musicCredits,
    collaborators: (credits as Record<string, unknown>).collaborators,
    partners: (partnersDoc as Record<string, unknown>).partners,
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const content = await loadContent();
  const covers = await getCoverImages();
  if (Object.keys(covers).length === 0) return content;
  return {
    ...content,
    products: content.products.map((p) =>
      covers[p.slug] ? { ...p, coverImage: `/api/cover/${p.slug}?v=${covers[p.slug].v}` } : p
    ),
  };
});

async function loadContent(): Promise<SiteContent> {
  if (!sanityEnabled()) return sanitizeContent({});
  try {
    const draft = await draftMode()
      .then((dm) => dm.isEnabled)
      .catch(() => false);

    if (draft) {
      const { data } = await sanityFetch({ query: QUERY });
      return sanitizeContent(mapDocs((data as RawDocs) ?? {}), siteDefaults, { lenient: true });
    }

    const data = await sanityClient
      .withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: true, stega: false })
      .fetch<RawDocs>(QUERY, {}, { next: { revalidate: 60, tags: ["site-content"] } });
    return sanitizeContent(mapDocs(data ?? {}), siteDefaults, { lenient: false });
  } catch (e) {
    console.error("Sanity fetch failed; serving defaults:", e);
    return sanitizeContent({});
  }
}
