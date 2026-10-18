import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { withNewReleases } from "@/lib/catalogue";
import { TrustedByStrip } from "@/components/credentials";
import { HeroWall } from "@/components/hero-wall";
import { VideoWall } from "@/components/video-wall";
import { ReelWall } from "@/components/reel-wall";
import { ReleaseWall } from "@/components/release-wall";
import { InstagramProfile, SpotifyPlaylist } from "@/components/embeds";
import { GradeCompare } from "@/components/grade-compare";
import { PhotoWall } from "@/components/photo-wall";
import { compares, photoSets, reels, type WorkLane } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Color, video, photos, and records by Andrei Sutton. Tour recaps, grades, concert photography, channel edits, and his own releases.",
};

const LANES: WorkLane[] = ["color", "video", "photo", "music"];

export default async function WorkPage() {
  const content = await getSiteContent();
  const { pages, credentials, home, videoWork } = content;
  const musicCredits = await withNewReleases(content.musicCredits);
  const copy = pages.work;

  return (
    <>
      <section className="grain-panel relative overflow-hidden border-b border-line bg-surface/30">
        <HeroWall scrims={false} />
        <div className="wall-read" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="h-title text-6xl sm:text-8xl">{copy.heading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{copy.intro}</p>
          </div>
        </div>
      </section>

      <TrustedByStrip heading={home.trustedHeading} credentials={credentials} />

      {LANES.map((lane) => {
        const videos = videoWork.filter((v) => (v.lane ?? "video") === lane);
        const laneReels = reels.filter((r) => r.lane === lane);
        const records = lane === "music" ? musicCredits : [];
        const photos = lane === "photo" ? photoSets : [];
        if (!videos.length && !laneReels.length && !records.length && !photos.length) return null;
        const l = copy.lanes[lane];

        return (
          <section data-reveal key={lane} id={lane} className="scroll-mt-16 border-b border-line">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="h-editorial text-4xl sm:text-5xl">{l.heading}</h2>
                <p className="text-sm text-muted">{l.note}</p>
              </div>

              {lane === "color" && (
                <div className="mt-7 grid items-start gap-6 lg:grid-cols-[16fr_6fr] lg:gap-5">
                  <GradeCompare hue={25} idKey="work-footage" set={compares.footage} />
                  <GradeCompare
                    hue={16}
                    idKey="work-photo"
                    set={compares.photo}
                    className="mx-auto w-[78%] max-w-sm lg:w-full lg:max-w-none"
                  />
                </div>
              )}

              {videos.length > 0 && (
                <div className="mt-7">
                  <VideoWall videos={videos} />
                </div>
              )}

              {photos.length > 0 && <PhotoWall sets={photos} className="mt-8" />}

              {records.length > 0 && (
                <div className="mt-10">
                  <h3 className="h-rule text-[10px] sm:text-[11px]">{copy.recordsNote}</h3>
                  <ReleaseWall records={records} className="mt-4" />
                </div>
              )}

              {lane === "music" && (
                <div className="mt-10">
                  <h3 className="h-rule text-[10px] sm:text-[11px]">{copy.listenNote}</h3>
                  <div className="mt-4">
                    <SpotifyPlaylist height={420} />
                  </div>
                </div>
              )}

              {laneReels.length > 0 && (
                <div className="mt-10">
                  <h3 className="h-rule text-[10px] sm:text-[11px]">{copy.reelsNote}</h3>
                  <ReelWall reels={laneReels} className="mt-4" />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section data-reveal className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-editorial text-4xl sm:text-5xl">{copy.igHeading}</h2>
            <p className="text-sm text-muted">{copy.igNote}</p>
          </div>
          <InstagramProfile className="mt-6" />
        </div>
      </section>
    </>
  );
}
