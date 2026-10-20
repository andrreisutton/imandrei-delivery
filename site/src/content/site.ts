export const brand = {
  name: "Andrei Sutton",
  shortName: "ANDREI!",
  tagline: "Cinema color. Radio vocals.",
  description:
    "The PowerGrade, presets, and templates behind my shoots and records, plus custom mixing, mastering, and monthly editing for artists and channels. Instant delivery.",
  email: "",
  logo: "/brand/andrei-logo-white.png",
  logoDark: "/brand/andrei-logo-black.png",
};

export const instagramHref = "https://instagram.com/andreisutton";

export const socials: { label: string; href: string }[] = [
  { label: "Instagram", href: instagramHref },
  { label: "TikTok", href: "https://tiktok.com/@andreisutton" },
  { label: "YouTube", href: "https://youtube.com/@andreisutton" },
  { label: "Spotify", href: "https://open.spotify.com/artist/34oYRq2HTzpGsMA8WWjvlV" },
  { label: "Twitch", href: "https://twitch.tv/andreisutton" },
  { label: "Snapchat", href: "https://www.snapchat.com/add/andreisutton69" },
];

export type Credential = {
  name: string;
  role: string;
  videoUrl?: string;
  avatar?: string;
  instagram?: string;
};

export const credentials: Credential[] = [
  {
    name: "Ian",
    role: "US Tour Pt. 2 recap, shot and edited",
    videoUrl: "https://www.youtube.com/watch?v=s3wYxy3mg48",
    avatar: "/avatars/ian.jpg",
    instagram: "https://www.instagram.com/iaaaaaaaaaaannnnnnnn/",
  },
  {
    name: "Lil Skies",
    role: "Tour recap, shot, cut, and colored",
    videoUrl: "https://www.youtube.com/watch?v=MnZgt0shLco",
    avatar: "/avatars/lilskies.jpg",
    instagram: "https://www.instagram.com/lilskies/",
  },
  {
    name: "BabyTron",
    role: "Out On Bond, official concert recap",
    videoUrl: "https://www.youtube.com/watch?v=ykBo8ExufGU",
    avatar: "/avatars/babytron.jpg",
    instagram: "https://www.instagram.com/babytron/",
  },
  {
    name: "The Kid LAROI",
    role: "Chicago show recap, shot and edited",
    videoUrl: "https://www.instagram.com/reel/DY2go9pqCa4/",
    avatar: "/avatars/thekidlaroi.jpg",
    instagram: "https://www.instagram.com/thekidlaroi/",
  },
  {
    name: "Will Swinton",
    role: "Artist visuals and recaps",
    videoUrl: "https://www.youtube.com/shorts/C-deacPxHLM",
    avatar: "/avatars/willswinton.jpg",
    instagram: "https://www.instagram.com/willswinton/",
  },
];

export type WorkLane = "color" | "video" | "photo" | "music";

export type VideoWork = {
  videoId: string;
  title: string;
  credit: string;
  year: string;
  lane?: WorkLane;
  local?: { src: string; poster: string; href: string };
};

export type Reel = { url: string; lane: WorkLane; caption?: string };

export const reels: Reel[] = [];

export const videoWork: VideoWork[] = [
  {
    videoId: "laroi-chicago-2026",
    lane: "color",
    title: "The Kid LAROI, Chicago 5.22.26",
    credit: "Shot and edited by me",
    year: "2026",
    local: {
      src: "/grade/laroi-chicago.mp4",
      poster: "/grade/laroi-chicago.jpg",
      href: "https://www.instagram.com/reel/DY2go9pqCa4/",
    },
  },
  {
    videoId: "MnZgt0shLco",
    lane: "color",
    title: "Lil Skies, Tour recap",
    credit: "Shot, cut, and colored by me",
    year: "2025",
  },
  {
    videoId: "s3wYxy3mg48",
    lane: "color",
    title: "ian, US Tour Pt. 2 recap",
    credit: "Shot and edited by me at Cain's Ballroom, Tulsa",
    year: "2025",
  },
  {
    videoId: "ykBo8ExufGU",
    lane: "color",
    title: "BabyTron, Out On Bond",
    credit: "Official concert recap, shot and cut by me",
    year: "2024",
  },
  {
    videoId: "1w7j5MoEQgc",
    lane: "music",
    title: "andrei!, colorado",
    credit: "Performed by andrei!, directed by Khiernan K Films",
    year: "2025",
  },
  {
    videoId: "9kBDzXvyl7Y",
    lane: "music",
    title: "andrei!, GONE",
    credit: "Written, recorded, and released by me",
    year: "2026",
  },
  {
    videoId: "WrlMbDmLpc4",
    lane: "color",
    title: "ian, live in Tulsa",
    credit: "Shot and cut by me",
    year: "2025",
  },
  {
    videoId: "PEFIcQPycAE",
    lane: "video",
    title: "The Premiere to DaVinci color method",
    credit: "The workflow the Everyday PowerGrade is built on",
    year: "2025",
  },
  {
    videoId: "dKtveWmDO0g",
    lane: "video",
    title: "How I edit concert recaps in Premiere Pro",
    credit: "My recap workflow, start to finish",
    year: "2025",
  },
  {
    videoId: "bKZNkvkzzL0",
    lane: "video",
    title: "The Premiere Pro plugin that sped up my workflow",
    credit: "The editing setup behind the recaps",
    year: "2025",
  },
  {
    videoId: "G6LYDR_4zsE",
    lane: "video",
    title: "The only vocal preset you will ever need",
    credit: "The chain behind the vocal presets in my store",
    year: "2025",
  },
  {
    videoId: "E2ScMAKUSk8",
    lane: "video",
    title: "How to sound like The Kid LAROI in FL Studio",
    credit: "Vocal chain walkthrough",
    year: "2025",
  },
  {
    videoId: "srQB8YaDZD0",
    lane: "video",
    title: "My free FL Studio preset",
    credit: "A free vocal preset, start to finish",
    year: "2025",
  },
  {
    videoId: "WjoVy_8EhfM",
    lane: "music",
    title: "Making a song live",
    credit: "Written and recorded on stream",
    year: "2025",
  },
  {
    videoId: "sOvm5_vJfPo",
    lane: "music",
    title: "Making a song for the album, live",
    credit: "Written and recorded on stream",
    year: "2025",
  },
  {
    videoId: "l_oxT_R3gpU",
    lane: "color",
    title: "Zurkie, show recap (long form)",
    credit: "Edited by me for zurkie",
    year: "2026",
  },
  {
    videoId: "lx_3KnI2SeA",
    lane: "color",
    title: "Zurkie, VHS cut",
    credit: "Edited by me for zurkie",
    year: "2026",
  },
  {
    videoId: "8dC7ARXb7ho",
    lane: "color",
    title: "Zurkie, show recap (short form)",
    credit: "Edited by me for zurkie",
    year: "2026",
  },
];

export type EditingClient = {
  name: string;
  role: string;
  note: string;
  href?: string;
  links?: {
    label: string;
    href: string;
    banner?: string;
    avatar?: string;
    handle?: string;
    subscribers?: string;
    videos?: string;
    description?: string;
  }[];
};

export type MusoStat = { value: string; label: string };
export type MusoTrack = {
  title: string;
  artists: string;
  streams: string;
  href: string;
  cover: string;
};

export const industry = {
  musoUrl: "https://muso.ai/profile/8b1a692c-2774-4193-99eb-c86e2a4afce8",
  musoLabel: "My credits on muso.ai",
  muso: {
    statsNote: "Lifetime, from my muso.ai analytics, August 2026",
    stats: [
      { value: "3M", label: "Streams" },
      { value: "314K", label: "Video views" },
      { value: "665", label: "Shazams" },
      { value: "401", label: "Videos" },
    ] as MusoStat[],
    rolesNote: "Credited on muso.ai",
    roles: [
      { value: "83", label: "Credits" },
      { value: "21", label: "Producer" },
      { value: "15", label: "Engineer" },
      { value: "10", label: "Mixing" },
    ] as MusoStat[],
    chart: "Top 25% of songwriters on muso.ai, week of Aug 6 to 13, 2026",
    topHeading: "Most streamed",
    top: [
      {
        title: "new world",
        artists: "andrei!, Valious",
        streams: "257,803",
        href: "https://open.spotify.com/track/2U2vMjJid9QkW4eZPMeQZc",
        cover: "/covers/new-world.jpg",
      },
      {
        title: "new world",
        artists: "andrei!, Vxlious",
        streams: "181,052",
        href: "https://open.spotify.com/track/4eVj6B7jmrJVPEqeX1dKHI",
        cover: "/covers/idk-what-im-doing-anymore.jpg",
      },
      {
        title: "time!",
        artists: "andrei!, Valious",
        streams: "24,089",
        href: "https://open.spotify.com/track/2YJU3l5zevgui7eMEDxDCU",
        cover: "/covers/can-t-go-back-to-the-way-it-was.jpg",
      },
    ] as MusoTrack[],
  },
  reach: {
    value: "3M",
    label: "streams on the records I'm credited on",
  },
  editingClients: [
    {
      name: "",
      role: "Video editor, long form and shorts",
      note: "One of the largest hockey channels on YouTube",
      links: [
        {
          label: "Trew Crew",
          href: "https://www.youtube.com/c/trewcrew",
          banner: "/credits/trewcrew-banner.jpg",
          avatar: "/credits/trewcrew-avatar.jpg",
          handle: "@trewcrew",
          subscribers: "269K subscribers",
          videos: "466 videos",
          description: "I make ice hockey videos :)",
        },
      ],
    },
    {
      name: "zurkie",
      role: "Video editor on channel uploads",
      note: "Storytelling vlogs on YouTube",
      href: "https://www.youtube.com/@zurkie",
      links: [
        {
          label: "The Zurkie Show",
          href: "https://www.youtube.com/@thezurkieshow",
          banner: "/credits/zurkieshow-banner.jpg",
          avatar: "/credits/zurkieshow-avatar.jpg",
          handle: "@thezurkieshow",
          subscribers: "130K subscribers",
          videos: "237 videos",
          description: "A fireside chat in the 21st century.",
        },
      ],
    },
  ] as EditingClient[],
};

export type MusicCredit = {
  title: string;
  kind: string;
  artists: string;
  role: string;
  year: string;
  href: string;
  cover: string;
  platform?: "spotify" | "apple";
};

export const CATALOGUE_THROUGH = "2026-09-18";
export const APPLE_ARTIST_ID = "1731667293";

export const musicCredits: MusicCredit[] = [
  {
    title: "LET ME DOWN",
    kind: "Single",
    artists: "andrei! with CNN Mikey",
    role: "Performed, mixed, and mastered as andrei!",
    year: "2026",
    href: "https://open.spotify.com/track/0sizBw7nSXZ19wnNseQa7Q",
    cover: "/covers/let-me-down.jpg",
  },
  {
    title: "nothing right",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/4xWJAQxDyl8inivPFW85Uw",
    cover: "/covers/nothing-right.jpg",
  },
  {
    title: "STRESSFUL",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/0WNV1Aye8fyPm80ZJuFl5G",
    cover: "/covers/stressful.jpg",
  },
  {
    title: "SO HARD",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/667rOwGur3KR0HqUtM6ieI",
    cover: "/covers/so-hard.jpg",
  },
  {
    title: "FEELS RIGHT",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/6M74WBJag0r2eIXQoqVVVf",
    cover: "/covers/feels-right.jpg",
  },
  {
    title: "CAN'T STAY",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/5N6rsmxJbHo0SAyVS2tQWc",
    cover: "/covers/can-t-stay.jpg",
  },
  {
    title: "WASTE TIME",
    kind: "Single",
    artists: "andrei! with 73Delta",
    role: "2 songs, written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/2rA2jvqvbhUuEWrxF5zCOQ",
    cover: "/covers/waste-time.jpg",
  },
  {
    title: "21",
    kind: "Album",
    artists: "andrei! with Gavin Ross, Jadon Reese, and SAM!",
    role: "8 songs, written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/1dbYQqntQvijcc31f0aAyb",
    cover: "/covers/21.jpg",
  },
  {
    title: "AIN'T OVER",
    kind: "Single",
    artists: "andrei! with cam85",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/72wlrRjvaXjyhFGRrNsTlh",
    cover: "/covers/ain-t-over.jpg",
  },
  {
    title: "WAY OUT",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/0jLBCNRI5UbjBi0muYhga4",
    cover: "/covers/way-out.jpg",
  },
  {
    title: "MY WAY",
    kind: "Single",
    artists: "andrei! with Cosaa!",
    role: "Written and performed as andrei!",
    year: "2026",
    href: "https://open.spotify.com/album/7DiQx4hOBBBz9rFEBnpMfz",
    cover: "/covers/my-way.jpg",
  },
  {
    title: "NOT LIKE THE REST",
    kind: "Single",
    artists: "andrei! with Sammye Jenkins",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/6oqblPFj1fvy19RWMRsLB4",
    cover: "/covers/not-like-the-rest.jpg",
  },
  {
    title: "SOLO",
    kind: "Single",
    artists: "andrei! with Cosaa!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/6uy1UvniZioCkbk09XjaSP",
    cover: "/covers/solo.jpg",
  },
  {
    title: "Cold October",
    kind: "Single",
    artists: "nxwhere featuring andrei!",
    role: "Featured artist on nxwhere's record",
    year: "2025",
    href: "https://open.spotify.com/album/4GKc88wP1YEOVBvfx5RZ9z",
    cover: "/covers/cold-october.jpg",
  },
  {
    title: "ENOUGH?",
    kind: "EP",
    artists: "andrei! with dcmbur",
    role: "4 songs, written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/28Jnzn7GGqk4IlCHDX5h5H",
    cover: "/covers/enough.jpg",
  },
  {
    title: "RUNNING OUT OF TIME",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/1g5xam9Q9H7ClBe5Yueitd",
    cover: "/covers/running-out-of-time.jpg",
  },
  {
    title: "ESSENTIAL!",
    kind: "Single",
    artists: "andrei! with Trendy",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/2DvwKqSg3sf6YNz8oqQYqJ",
    cover: "/covers/essential.jpg",
  },
  {
    title: "12345",
    kind: "Single",
    artists: "andrei! with Ethan Terrana",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/4eL3yH1pusgnSTaQcTxjv6",
    cover: "/covers/12345.jpg",
  },
  {
    title: "WORTH",
    kind: "Single",
    artists: "andrei! with Verdae",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/2kS3VKkJfCOwV3hhuckF3b",
    cover: "/covers/worth.jpg",
  },
  {
    title: "HEARING",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/4JcavHiXBij5M5gj87GBih",
    cover: "/covers/hearing.jpg",
  },
  {
    title: "12 AM DRAFTS",
    kind: "Single",
    artists: "andrei! with Jai XO",
    role: "2 songs, written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/119RrDZsqdfVOQ99q84jDL",
    cover: "/covers/12-am-drafts.jpg",
  },
  {
    title: "HATE NOW",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/7dCneDM9Vbd0BPjmveZVwp",
    cover: "/covers/hate-now.jpg",
  },
  {
    title: "MAKE IT OUT ALIVE",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/3Oxwbj63IAqGRDdEyXeVxS",
    cover: "/covers/make-it-out-alive.jpg",
  },
  {
    title: "ANOTHER DAY",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/7u3sOVaz4lii13pyO7RxyL",
    cover: "/covers/another-day.jpg",
  },
  {
    title: "love me",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/17ZohMeQyNDfXGSJuLLLEu",
    cover: "/covers/love-me.jpg",
  },
  {
    title: "TW!STED",
    kind: "Single",
    artists: "andrei! with X A N",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/3LDKhATx0GuhVG1Gy8ZAwk",
    cover: "/covers/tw-sted.jpg",
  },
  {
    title: "parents lakehouse",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/61fSe8KcBK1CdcylDovPOH",
    cover: "/covers/parents-lakehouse.jpg",
  },
  {
    title: "what time will you be over?",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/5qHMlahI4JkmIXw11MY0B5",
    cover: "/covers/what-time-will-you-be-over.jpg",
  },
  {
    title: "PAVEMYWAY",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/3EqJq6ia0rr056ETMLxN4A",
    cover: "/covers/pavemyway.jpg",
  },
  {
    title: "BAD!",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/0Bd3GIL9SVCCpSks5The4i",
    cover: "/covers/bad.jpg",
  },
  {
    title: "too gnarly",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/674U2Tx8w6CrvOVd0610hE",
    cover: "/covers/too-gnarly.jpg",
  },
  {
    title: "NAMELESS",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/7dz8c573atSHFn24P2Cbvd",
    cover: "/covers/nameless.jpg",
  },
  {
    title: "SCARED2FALLINLOVE",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/2eZiN5d9VNBF6DunjLfWEB",
    cover: "/covers/scared2fallinlove.jpg",
  },
  {
    title: "Can't Go Back To The Way It Was",
    kind: "Album",
    artists: "andrei! with Valious",
    role: "7 songs, written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/2fF9Vee0lJljsTS3S8k7bl",
    cover: "/covers/can-t-go-back-to-the-way-it-was.jpg",
  },
  {
    title: "PERSONAL",
    kind: "Single",
    artists: "andrei! with dcmbur",
    role: "Written and performed as andrei!",
    year: "2025",
    href: "https://open.spotify.com/album/6Lh44jJZUr79vAlGRq1Ii5",
    cover: "/covers/personal.jpg",
  },
  {
    title: "EUPHORIA!",
    kind: "Single",
    artists: "andrei! with dcmbur",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/50km8RBpgZgekRigjkKxKD",
    cover: "/covers/euphoria.jpg",
  },
  {
    title: "have to",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/5LoSeRIVqewQup9g9og7vh",
    cover: "/covers/have-to.jpg",
  },
  {
    title: "time!",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/1M93o6CbZmlblbJu5Tlrg8",
    cover: "/covers/time.jpg",
  },
  {
    title: "SAVAGE",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/4giNKMHdO9JNk5ytKDYVX5",
    cover: "/covers/savage.jpg",
  },
  {
    title: "all we have is now.",
    kind: "Album",
    artists: "andrei! with dcmbur, Verdae, Jameson Hurst, Zero Limit, and pak",
    role: "7 songs, written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/68q1Xic7ZkHnIGzWKArtQs",
    cover: "/covers/all-we-have-is-now.jpg",
  },
  {
    title: "idk what im doing anymore",
    kind: "Single",
    artists: "andrei! with Trebans and Vxlious",
    role: "2 songs, written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/2Qifri987mPEDuxK94i233",
    cover: "/covers/idk-what-im-doing-anymore.jpg",
  },
  {
    title: "new world",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/6vbJI9x2zRHaK6PTjUKhQE",
    cover: "/covers/new-world.jpg",
  },
  {
    title: "maintain",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/1fHCzFProvlqgux682Sqqo",
    cover: "/covers/maintain.jpg",
  },
  {
    title: "lowkey",
    kind: "Single",
    artists: "andrei! with Valious",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/5eqf6EqDWeYXReK2Aa9eer",
    cover: "/covers/lowkey.jpg",
  },
  {
    title: "old me.",
    kind: "Single",
    artists: "andrei!",
    role: "Written and performed as andrei!",
    year: "2024",
    href: "https://open.spotify.com/album/7e1HOemcriAQvSEqVGLtfE",
    cover: "/covers/old-me.jpg",
  },
  {
    title: "is this what you expected?",
    kind: "Album",
    artists: "JAIRUHME featuring andrei!",
    role: "Featured artist on you would",
    year: "2024",
    href: "https://open.spotify.com/album/7mi5OP8pq59Dgtouc5vx0W",
    cover: "/covers/is-this-what-you-expected.jpg",
  },
];

export const collaborators: Credential[] = [
  {
    name: "CNN Mikey",
    role: "Featured on LET ME DOWN",
    videoUrl: "https://open.spotify.com/track/0sizBw7nSXZ19wnNseQa7Q",
  },
  {
    name: "Valious",
    role: "7 records together, including ANOTHER DAY",
    videoUrl: "https://open.spotify.com/album/7u3sOVaz4lii13pyO7RxyL",
  },
  {
    name: "dcmbur",
    role: "4 records together, including ENOUGH?",
    videoUrl: "https://open.spotify.com/album/28Jnzn7GGqk4IlCHDX5h5H",
  },
  {
    name: "Cosaa!",
    role: "MY WAY and SOLO",
    videoUrl: "https://open.spotify.com/album/7DiQx4hOBBBz9rFEBnpMfz",
  },
  {
    name: "Verdae",
    role: "WORTH and all we have is now.",
    videoUrl: "https://open.spotify.com/album/2kS3VKkJfCOwV3hhuckF3b",
  },
  {
    name: "73Delta",
    role: "WASTE TIME",
    videoUrl: "https://open.spotify.com/album/2rA2jvqvbhUuEWrxF5zCOQ",
  },
  {
    name: "cam85",
    role: "AIN'T OVER",
    videoUrl: "https://open.spotify.com/album/72wlrRjvaXjyhFGRrNsTlh",
  },
  {
    name: "Ethan Terrana",
    role: "12345",
    videoUrl: "https://open.spotify.com/album/4eL3yH1pusgnSTaQcTxjv6",
  },
  {
    name: "Gavin Ross",
    role: "21",
    videoUrl: "https://open.spotify.com/album/1dbYQqntQvijcc31f0aAyb",
  },
  {
    name: "Jadon Reese",
    role: "21",
    videoUrl: "https://open.spotify.com/album/1dbYQqntQvijcc31f0aAyb",
  },
  {
    name: "Jai XO",
    role: "12 AM DRAFTS",
    videoUrl: "https://open.spotify.com/album/119RrDZsqdfVOQ99q84jDL",
  },
  {
    name: "JAIRUHME",
    role: "is this what you expected?",
    videoUrl: "https://open.spotify.com/album/7mi5OP8pq59Dgtouc5vx0W",
  },
  {
    name: "Jameson Hurst",
    role: "all we have is now.",
    videoUrl: "https://open.spotify.com/album/68q1Xic7ZkHnIGzWKArtQs",
  },
  {
    name: "nxwhere",
    role: "Cold October",
    videoUrl: "https://open.spotify.com/album/4GKc88wP1YEOVBvfx5RZ9z",
  },
  {
    name: "pak",
    role: "all we have is now.",
    videoUrl: "https://open.spotify.com/album/68q1Xic7ZkHnIGzWKArtQs",
  },
  {
    name: "SAM!",
    role: "21",
    videoUrl: "https://open.spotify.com/album/1dbYQqntQvijcc31f0aAyb",
  },
  {
    name: "Sammye Jenkins",
    role: "NOT LIKE THE REST",
    videoUrl: "https://open.spotify.com/album/6oqblPFj1fvy19RWMRsLB4",
  },
  {
    name: "Trebans",
    role: "idk what im doing anymore",
    videoUrl: "https://open.spotify.com/album/2Qifri987mPEDuxK94i233",
  },
  {
    name: "Trendy",
    role: "ESSENTIAL!",
    videoUrl: "https://open.spotify.com/album/2DvwKqSg3sf6YNz8oqQYqJ",
  },
  {
    name: "Vxlious",
    role: "idk what im doing anymore",
    videoUrl: "https://open.spotify.com/album/2Qifri987mPEDuxK94i233",
  },
  {
    name: "X A N",
    role: "TW!STED",
    videoUrl: "https://open.spotify.com/album/3LDKhATx0GuhVG1Gy8ZAwk",
  },
  {
    name: "Zero Limit",
    role: "all we have is now.",
    videoUrl: "https://open.spotify.com/album/68q1Xic7ZkHnIGzWKArtQs",
  },
  {
    name: "Khiernan K Films",
    role: "Directed the colorado video",
    videoUrl: "https://www.youtube.com/watch?v=1w7j5MoEQgc",
  },
  {
    name: "zurkie",
    role: "The channel I edit for on YouTube",
    videoUrl: "https://www.youtube.com/@zurkie",
  },
];

export type Partner = {
  name: string;
  what: string;
  code: string;
  perk: string;
  href: string;
  referral?: boolean;
};

export const partners: Partner[] = [
  {
    name: "FL Studio",
    what: "The DAW behind every vocal chain I sell here",
    code: "",
    perk: "",
    href: "https://www.image-line.com/fl-studio/",
  },
  {
    name: "Comfrt",
    what: "Comfort wear I'm an affiliate for",
    code: "",
    perk: "",
    href: "https://comfrt.com/ANDREI35",
    referral: true,
  },
  {
    name: "My Camera Kit",
    what: "The exact bodies, glass, and audio gear I shoot on",
    code: "",
    perk: "",
    href: "https://www.amazon.com/shop/andreisutton",
    referral: true,
  },
  {
    name: "LANDR",
    what: "Mastering and distribution I run my releases through",
    code: "",
    perk: "",
    href: "https://join.landr.com/referral/landr-studio/?utm_campaign=sales_platform_en_intl_1stpromoter&utm_medium=paid_referral&utm_source=landr&fpr=aexotic29",
    referral: true,
  },
  {
    name: "DistroKid",
    what: "How I get my records onto every streaming platform",
    code: "",
    perk: "",
    href: "https://distrokid.com/vip/seven/4550336",
    referral: true,
  },
  {
    name: "muze.fyi",
    what: "Wayvbeats' plugin — I ran the ad campaigns for the launch",
    code: "",
    perk: "",
    href: "https://muze.fyi",
  },
];

export type CompareKey = "footage" | "photo";

export type CompareSet = {
  kind: "video" | "image";
  before: string;
  after: string;
  beforeSm?: string;
  afterSm?: string;
  beforePoster?: string;
  afterPoster?: string;
  beforeLabel: string;
  afterLabel: string;
  aspect: "video" | "portrait";
  caption: string;
  captionHref?: string;
};

export const compares: Record<CompareKey, CompareSet> = {
  footage: {
    kind: "video",
    before: "/grade/footage-before-1280.mp4",
    after: "/grade/footage-after-1280.mp4",
    beforeSm: "/grade/footage-before-960.mp4",
    afterSm: "/grade/footage-after-960.mp4",
    beforePoster: "/grade/footage-before.jpg",
    afterPoster: "/grade/footage-after.jpg",
    beforeLabel: "Ungraded, no effects",
    afterLabel: "Final",
    aspect: "video",
    caption: "ian, US Tour Pt. 2. The same cut before and after my grade, titles, and transitions.",
    captionHref: "https://youtu.be/u__UrPnkzYI",
  },
  photo: {
    kind: "image",
    before: "/grade/ian-photo-raw.jpg",
    after: "/grade/ian-photo-edited.jpg",
    beforeLabel: "Raw",
    afterLabel: "Edited",
    aspect: "portrait",
    caption: "ian, live. My photo, raw and edited.",
    captionHref: "https://www.instagram.com/p/DGC3WLERLXz/",
  },
};

export type Photo = { src: string; w: number; h: number; alt: string };
export type PhotoSet = {
  id: string;
  artist: string;
  note: string;
  href: string;
  photos: Photo[];
};

const p = (src: string, w: number, h: number, alt: string): Photo => ({ src, w, h, alt });

export const photoSets: PhotoSet[] = [
  {
    id: "lil-skies",
    artist: "Lil Skies",
    note: "Oct 2025",
    href: "https://www.instagram.com/p/DPcXc8OEbD3/",
    photos: [
      p("/photos/skies-1.jpg", 1200, 1500, "Lil Skies performing, head bowed over the mic"),
      p("/photos/skies-0.jpg", 1200, 1500, "Lil Skies under green light"),
      p("/photos/skies-3.jpg", 1200, 1500, "Lil Skies mid-verse under blue light"),
      p("/photos/skies-6.jpg", 1200, 1500, "Lil Skies in black and white through stage smoke"),
      p("/photos/skies-2.jpg", 1200, 1500, "Lil Skies looking down, lit blue"),
      p("/photos/skies-5.jpg", 1200, 1500, "Lil Skies under red light"),
    ],
  },
  {
    id: "ian",
    artist: "ian",
    note: "On tour, Feb 2025",
    href: "https://www.instagram.com/p/DGC3WLERLXz/",
    photos: [
      p("/photos/ian-2.jpg", 1200, 1500, "ian crouched at the front of the stage, mic up"),
      p("/photos/ian-0.jpg", 1200, 1500, "ian singing under warm light"),
      p("/photos/ian-4.jpg", 1200, 1500, "ian backlit by red stage lights"),
      p("/photos/ian-1.jpg", 1200, 1500, "ian performing in red haze"),
    ],
  },
  {
    id: "babytron",
    artist: "BabyTron",
    note: "The Granada, Nov 2024",
    href: "https://www.instagram.com/p/DCdgg8XMGw5/",
    photos: [
      p("/photos/tron-6.jpg", 1080, 1350, "BabyTron in a white spotlight over the crowd"),
      p("/photos/tron-0.jpg", 1080, 1350, "BabyTron in red light, mic in hand"),
      p("/photos/tron-7.jpg", 1080, 1350, "BabyTron under blue light, pointing out"),
      p("/photos/tron-3.jpg", 1080, 1350, "BabyTron through a crowd of raised phones"),
    ],
  },
];

export type Daw = "DaVinci Resolve" | "Premiere Pro" | "Lightroom" | "FL Studio";

export const ALL_DAWS: Daw[] = ["DaVinci Resolve", "Premiere Pro", "Lightroom", "FL Studio"];

export type Cta = { label: string; href: string };

export type Session = {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
};

export type Product = {
  slug: string;
  type: "preset" | "template" | "service";
  daw?: Daw;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  price: number;
  compareAtPrice?: number;
  badge?: string;
  coverHue: number;
  image?: string;
  showGradeCompare?: boolean;
  gradeBefore?: string;
  gradeAfter?: string;
  gradeCaption?: string;
  gradeCaptionHref?: string;
  compare?: CompareKey;
  fileName?: string;
  soldOut?: boolean;
  audioBefore?: string;
  audioAfter?: string;
  audioCaption?: string;
};

export const products: Product[] = [
  {
    slug: "everyday-powergrade",
    type: "preset",
    daw: "DaVinci Resolve",
    title: "Everyday PowerGrade",
    subtitle: "Color grading system for DaVinci Resolve",
    gradeBefore: "/grade/ian-before.jpg",
    gradeAfter: "/grade/ian-after.jpg",
    gradeCaption: "ian, US Tour Pt. 2. Shot, cut, and graded by me.",
    gradeCaptionHref: "https://youtu.be/u__UrPnkzYI",
    compare: "footage",
    description:
      "The exact color workflow I run on every project, packed into one fully modular, node-based PowerGrade. Refined across commercial shoots, music videos, and tour recaps. Load it, match your shot, and ship filmic color fast.",
    includes: [
      ".drx and .dpx PowerGrade files",
      "Node-based control over every stage of the grade",
      "Built-in film grain, already dialed",
      "Full video walkthrough plus install guide",
      "Download link emailed the moment payment clears",
    ],
    price: 89,
    badge: "Flagship",
    coverHue: 300,
    showGradeCompare: true,
  },
  {
    slug: "go-to-lightroom-presets",
    type: "preset",
    daw: "Lightroom",
    title: "Go-To Lightroom Presets",
    subtitle: "Photo presets for Adobe Lightroom",
    description:
      "The presets behind the photo work on @flicsbyandrei. Built on real shoots, not sample packs: one-tap starting points that keep skin honest and color consistent, so you finish a set in minutes instead of nights.",
    includes: [
      "My go-to Lightroom presets",
      "Works in Lightroom and Lightroom Classic",
      "Every slider stays editable",
      "Download link emailed the moment payment clears",
    ],
    price: 39,
    coverHue: 264,
    showGradeCompare: true,
    compare: "photo",
  },
  {
    slug: "premiere-project-template",
    type: "template",
    daw: "Premiere Pro",
    title: "Premiere Pro Project Template",
    subtitle: "Folder structure and project file",
    description:
      "My working folder structure and Premiere Pro project file, the same setup behind my edits. Drop your footage into a system that already knows where everything goes, and start cutting instead of organizing.",
    includes: [
      "Complete project file, ready to open",
      "Folder structure for footage, audio, graphics, and exports",
      "Reusable on every project you start",
      "Download link emailed the moment payment clears",
    ],
    price: 29,
    coverHue: 320,
  },
  {
    slug: "social-animation-template",
    type: "template",
    daw: "Premiere Pro",
    title: "Social Media Animation Template",
    subtitle: "Animated titles for reels and posts",
    description:
      "The animation template I drop into my own reels and social edits. Clean, quick moving titles you customize in minutes, so your posts read finished instead of thrown together.",
    includes: [
      "Drag and drop into your edit",
      "Text and timing fully customizable",
      "Made for vertical and widescreen",
      "Download link emailed the moment payment clears",
    ],
    price: 34,
    coverHue: 240,
  },
  {
    slug: "vocal-presets-starter",
    type: "preset",
    daw: "FL Studio",
    title: "Vocal Presets: Starter",
    subtitle: "First vocal chain, stock plugins only",
    description:
      "For the artist who just got a mic and a laptop. One chain that takes a dry take to something you would actually post, built entirely on stock plugins so there is nothing else to buy. Every band and every knob is labeled, so you learn what you are hearing while you use it.",
    includes: [
      "One full vocal chain, stock plugins only",
      "Tuning, compression, EQ, and reverb already set",
      "Labeled so you learn what each stage does",
      "Setup walkthrough for your first session",
      "Download link emailed the moment payment clears",
    ],
    price: 29,
    badge: "Beginner",
    coverHue: 280,
    // Add real clips at these paths (site/public/audio/) to turn the
    // before/after player on for this product.
    // audioBefore: "/audio/vocal-starter-before.mp3",
    // audioAfter: "/audio/vocal-starter-after.mp3",
    // audioCaption: "Same dry take, run through the Starter chain.",
  },
  {
    slug: "vocal-presets-pro",
    type: "preset",
    daw: "FL Studio",
    title: "Vocal Presets: Pro",
    subtitle: "The full chain rack, for engineers",
    description:
      "The chains behind the andrei! records: lead, double, ad-lib, and background, plus the throwback and telephone sends that carry a hook. Built for people who already mix and want a faster start and a reference to pull apart.",
    includes: [
      "Lead, double, ad-lib, and background chains",
      "Throwback, telephone, and wide send effects",
      "Parallel compression and de-essing already set",
      "Notes on what to move first on a difficult take",
      "Download link emailed the moment payment clears",
    ],
    price: 79,
    badge: "Advanced",
    coverHue: 312,
    // Add real clips at these paths (site/public/audio/) to turn the
    // before/after player on for this product.
    // audioBefore: "/audio/vocal-pro-before.mp3",
    // audioAfter: "/audio/vocal-pro-after.mp3",
    // audioCaption: "Same dry take, run through the full Pro rack.",
  },
  {
    slug: "artist-promo-kit",
    type: "template",
    title: "Artist Promo Kit",
    subtitle: "Everything for rolling out a record",
    description:
      "The whole promo side of a release in one download. The color, the cut, and the titles I use to roll out my own records, so a song does not sit finished on a hard drive because the visuals are not ready.",
    includes: [
      "The Everyday PowerGrade for DaVinci Resolve",
      "The Go-To Lightroom presets for press photos",
      "The Premiere project and social animation templates",
      "The Starter vocal chain for FL Studio",
      "Download link emailed the moment payment clears",
    ],
    price: 149,
    badge: "Best value",
    coverHue: 256,
    showGradeCompare: true,
    compare: "footage",
  },
  {
    slug: "custom-mix",
    type: "service",
    title: "Custom Mix",
    subtitle: "Per song",
    description:
      "Send your stems, get back a mixed record. Vocal tuning, timing cleanup, and a mix referenced against the songs you want to sit next to. Two revisions included.",
    includes: [
      "Full mix of one song (up to 40 stems)",
      "Vocal tuning and timing cleanup",
      "Two revisions included",
      "Delivered in 3 to 5 days",
    ],
    price: 250,
    coverHue: 308,
  },
  {
    slug: "custom-mix-master",
    type: "service",
    title: "Mix + Master",
    subtitle: "Per song",
    description:
      "The full treatment. Everything in Custom Mix, plus a streaming-ready master loud enough for playlists and clean enough for the club. Two revisions included.",
    includes: [
      "Full mix of one song (up to 40 stems)",
      "Vocal tuning and timing cleanup",
      "Streaming-ready master (all platforms)",
      "Two revisions included",
      "Delivered in 3 to 5 days",
    ],
    price: 400,
    badge: "Most booked",
    coverHue: 308,
  },
  {
    slug: "master-only",
    type: "service",
    title: "Master Only",
    subtitle: "Per song",
    description:
      "Already have a mix you love? Send the stereo file and get back a streaming-ready master with the loudness and tone dialed for release.",
    includes: [
      "Master of one song from your stereo mix",
      "Loudness targets for all platforms",
      "One revision included",
      "Delivered in 1 to 2 days",
    ],
    price: 125,
    coverHue: 308,
  },
];

export const deliveryUrls: Record<string, string> = {
  "everyday-powergrade": "https://andreisutton.gumroad.com/l/mainpowergrade",
  "go-to-lightroom-presets": "https://andreisutton.gumroad.com/l/gotolightroompresets",
  "premiere-project-template": "https://andreisutton.gumroad.com/l/premiereprotemplate",
  "social-animation-template": "https://andreisutton.gumroad.com/l/socialstemplate",
};

export const sessions: Session[] = [
  {
    id: "attended-mix-2h",
    title: "Attended Mix Session",
    duration: "2 hours",
    price: 200,
    description:
      "Sit in on your mix. Hear changes in real time, give direction, and walk out with the record sounding how you imagined it.",
  },
  {
    id: "color-edit-1h",
    title: "Color & Edit Session",
    duration: "1 hour",
    price: 120,
    description:
      "One on one in DaVinci Resolve or Premiere Pro. Bring your footage, watch the grade come together on it, and leave with a workflow you can repeat.",
  },
];

export type Retainer = {
  id: string;
  title: string;
  volume: string;
  price: number;
  description: string;
  includes: string[];
  badge?: string;
};

export const retainers: Retainer[] = [
  {
    id: "creator",
    title: "Creator",
    volume: "4 long form edits a month",
    price: 900,
    description:
      "For the channel that posts weekly and keeps missing the upload because the edit is not done. One editor, one style, delivered on a schedule you can plan around.",
    includes: [
      "4 long form edits a month, up to 20 minutes each",
      "Color graded with the same PowerGrade in the store",
      "Two rounds of notes on every edit",
      "72 hour turnaround from footage drop",
    ],
  },
  {
    id: "channel",
    title: "Channel",
    volume: "8 long form edits plus shorts",
    price: 1800,
    description:
      "The full posting schedule handled. Long form, the shorts cut out of it, and thumbnails, so one drop of footage becomes a week of content.",
    includes: [
      "8 long form edits a month",
      "12 shorts cut from the same footage",
      "Thumbnails for every long form upload",
      "Two rounds of notes on every edit",
      "48 hour turnaround from footage drop",
    ],
    badge: "Most booked",
  },
  {
    id: "label",
    title: "Label",
    volume: "Weekly delivery, priority queue",
    price: 3200,
    description:
      "For artists and teams shipping constantly. I work your calendar week by week: visuals, recaps, socials, and the color on all of it.",
    includes: [
      "Weekly delivery against your release calendar",
      "Music video edits, tour recaps, and socials",
      "Color grading on everything that ships",
      "Priority queue and a direct line for rush cuts",
      "24 hour turnaround on anything urgent",
    ],
  },
];

export const home = {
  hero: {
    eyebrow: "Color · Editing · Presets · Mixing",
    headline: "Cinema color. Radio vocals.",
    sub: "The PowerGrade, presets, and templates I ship my own work with, plus mixing, mastering, and monthly editing.",
    primaryCta: { label: "Browse the store", href: "/store" },
    secondaryCta: { label: "See the services", href: "/services" },
  },
  trustedHeading: "Trusted by the teams of",
  daws: ["DaVinci Resolve", "Premiere Pro", "Lightroom", "FL Studio"],
  builtForLabel: "Built for",
  featuredHeading: "The tools",
  viewAllLabel: "View the full store",
  colorBand: {
    heading: "The same color on every project.",
    body: "There is no separate colorist, no look bought in for the job. The LUTs and the node tree I sell are the ones running on the tour recaps, the music videos, and the commercial work. Drag either frame: same footage, same photo, before and after me.",
    cta: { label: "See the grade", href: "/store/everyday-powergrade" },
  },
  photoBand: {
    heading: "Stills from the same shows.",
    body: "I shoot photo and video on the same night. Every frame here is from my own sets.",
  },
  musoBand: {
    heading: "The music, on the record.",
    body: "I release as andrei!. muso.ai tracks my streams and verifies my credits, and every credit is public on my profile.",
  },
  stepsHeading: "Pro finish in three steps",
  steps: [
    {
      title: "Pick your tool",
      body: "The PowerGrade, presets, and templates I actually edit with. Nothing padded, nothing extra to buy.",
    },
    {
      title: "Get it instantly",
      body: "Your download link lands in your inbox the second the payment clears. Open it and it is in your project.",
    },
    {
      title: "Finish like a pro",
      body: "Grade like the reels, cut like the tour recaps. And when it is a record on the line, send it here for the mix.",
    },
  ],
  serviceBlock: {
    headline: "Or hand the whole thing over.",
    body: "Presets and grades carry the look when you are doing it yourself. When it is your record or your posting schedule on the line, I take it end to end: the mix, the master, and the month of edits behind it.",
    cta: { label: "See the services", href: "/services" },
  },
  reviewsHeading: "From the buyers",
  allReviewsLabel: "All reviews",
  marqueeHeading: "The names first.",
  marqueeNote: "Tour recaps I shot, cut, and colored.",
  marqueeCta: "See all the work",
  finalHeading: "Your next drop starts tonight.",
  finalCta: { label: "Browse the store", href: "/store" },
};

export const pages = {
  presets: {
    heading: "The Store",
    intro:
      "PowerGrades, presets, templates, and vocal chains for DaVinci Resolve, Premiere Pro, Lightroom, and FL Studio. The same files I use on my own shoots and records. Your download link lands the moment payment clears.",
  },
  product: {
    buyLabel: "Buy now",
    instantLine: "Instant delivery",
    emailLine: "Link emailed to you",
    insideHeading: "What's inside",
    compareHeading: "Drag to see the grade",
    compareBefore: "Log",
    compareAfter: "Graded",
  },
  services: {
    heading: "Services",
    intro:
      "Three ways to hand work over: one record at a time, a month at a time, or an hour in the room with me.",
    outro: "Not sure which one fits? Send the details and I'll tell you straight.",
  },
  editing: {
    heading: "Monthly editing",
    intro:
      "I cut for one of the largest hockey channels on YouTube, for creators like zurkie, and for artists rolling out records. Same hands, same color, on a schedule instead of a one off.",
    tiersHeading: "Pick your volume",
    bookLabel: "Start the conversation",
    formHeading: "Tell me about the channel",
    formIntro:
      "What you post, how often, and where it keeps getting stuck. I'll reply within 24 hours with the tier that fits and what the first month looks like.",
    payNote:
      "Retainers start with a conversation, not a checkout. Nothing is charged until the scope is agreed.",
  },
  mixing: {
    heading: "Custom mixing & mastering",
    intro:
      "I'm an artist first. Send the stems and get back a record referenced against the songs you want to sit next to.",
    ctaLabel: "See pricing",
    tiersHeading: "Pick your treatment",
    bookLabel: "Book it",
    payNote: "Pay now to lock a slot, or send the details below first and pay after we talk.",
    formHeading: "Not sure which one?",
    formIntro:
      "Tell me about the record. I'll reply within 24 hours with a recommendation, the timeline, and how to send your files.",
    demoHeading: "Hear the difference",
    demoNote: "Same song, same moment. Switch between the rough and the mix.",
    demo: {
      title: "",
      credit: "",
      beforeSrc: "",
      afterSrc: "",
      beforeLabel: "Rough",
      afterLabel: "Mixed",
    },
  },
  work: {
    heading: "The work",
    intro:
      "Grouped by what it is: the color, the video, the photos, and the records. Every piece is public on my own channels, and every line says exactly what I did on it.",
    lanes: {
      color: { heading: "Color", note: "Grades, LUTs, and the PowerGrade running on real jobs." },
      video: { heading: "Video", note: "Tutorials and workflow breakdowns, start to finish." },
      photo: { heading: "Photo", note: "Stills from the same shows." },
      music: { heading: "Music", note: "Records I wrote, recorded, mixed, and released." },
    },
    reelsNote: "Straight from my Instagram.",
    recordsNote: "Everything I have put out.",
    listenNote: "Press play on any of it.",
    igHeading: "Straight off my feed",
    igNote: "The latest, before it lands anywhere else.",
    emptyLane: "More going up here shortly.",
  },
  credits: {
    heading: "Credits",
    intro:
      "The work, the teams behind it, and the records. Every video here is public on my own channels, every record opens on Spotify, and every credit line claims exactly what it shows.",
    workHeading: "The work",
    musicHeading: "In the music",
    musicIntro:
      "I release as andrei!, which is why a record you send lands with someone who has been on the other side of it. These are the records and the people on them.",
    recordsHeading: "The records",
    collabHeading: "The collaborators",
    editingHeading: "Editing credits",
  },
  partners: {
    heading: "Affiliates",
    intro:
      "The brands I actually work with, and the codes that come with them. Nothing here is a link I have not used myself.",
    codeLabel: "Code",
    copyLabel: "Copy code",
    copiedLabel: "Copied",
    visitLabel: "Visit",
    referralLabel: "Use my link",
    outro: "Working with a brand and want me on it? Send it over.",
  },
  book: {
    heading: "Book a session",
    intro:
      "Pick a session, pick a day, pick how long. Pay by card to lock it in; I'll confirm the exact start time by email within 24 hours.",
  },
  reviews: {
    heading: "Reviews",
    intro:
      "Every review here comes from a verified purchase. Buyers get a review link by email a few hours after buying; what they write is what you read.",
  },
  about: {
    heading: "About",
    paragraphs: [
      "I am Andrei Sutton. Videographer, photographer, and recording artist. Everything on this site, the PowerGrade, the presets and templates, the mixes, the monthly edits, comes straight out of the work I ship every week.",
      "I built these tools for my own projects first: commercial shoots, music videos, reels, tour recaps, and the records I release as andrei!. The store is not a product line I invented to sell; it is my actual working kit, packaged so you can load it and go. If I would not run it on my own project, it is not for sale here.",
      "The way I see it, you can be here today and gone tomorrow, so I stay grateful and I keep it honest. When you buy a preset, you get the real one. When you send me a record, it gets the same ear my own music gets. That is the whole deal.",
    ],
  },
};

export const checkoutCopy = {
  demoNote:
    "Demo checkout: payments go live at launch. No card is charged and any details work.",
};

export type SiteContent = {
  brand: typeof brand;
  socials: { label: string; href: string }[];
  credentials: Credential[];
  videoWork: VideoWork[];
  industry: typeof industry;
  musicCredits: MusicCredit[];
  collaborators: Credential[];
  partners: Partner[];
  products: Product[];
  deliveryUrls: Record<string, string>;
  sessions: Session[];
  retainers: Retainer[];
  home: typeof home;
  pages: typeof pages;
  checkoutCopy: typeof checkoutCopy;
};

export const siteDefaults: SiteContent = {
  brand,
  socials,
  credentials,
  videoWork,
  industry,
  musicCredits,
  collaborators,
  partners,
  products,
  deliveryUrls,
  sessions,
  retainers,
  home,
  pages,
  checkoutCopy,
};
