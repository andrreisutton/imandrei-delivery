import { Box, Card, Heading, Stack, Text } from "@sanity/ui";

const TASKS: [string, string][] = [
  ["Change a price, a description, or add a product", "Store"],
  ["Upload the file a buyer gets", "Store, open the product, Delivery tab (delivered once card payments are live)"],
  ["Add a YouTube video", "My Work & Credits, Videos: add an item and paste the link"],
  ["Pick the videos that lead the home page", 'My Work & Credits, Videos: switch on "Show on the home page"'],
  ["Add Instagram reels", "My Work & Credits, Reels: paste the reel link"],
  ["Add concert photos", "My Work & Credits, Photos: drag them in"],
  ["Swap the featured video (the Lil Skies one)", "My Work & Credits, Featured video"],
  ["Update your muso.ai numbers or records", "My Work & Credits, Music & credits"],
  ["Add a brand and its discount code", "Affiliates & Codes"],
  ["Change your Instagram, TikTok or other links", "Logo, Links & Socials"],
  ["Change any heading, paragraph or button", "Click it in Edit the site, or find it in Home Page or Other Pages"],
];

export function StartHere() {
  return (
    <Box padding={4} style={{ maxWidth: 720 }}>
      <Stack space={5}>
        <Stack space={3}>
          <Heading size={3}>Start here</Heading>
          <Text size={2} muted>
            Two ways to edit your site. Use whichever is easier.
          </Text>
        </Stack>

        <Card padding={4} radius={3} tone="primary" border>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              1. Edit the site (top of the screen)
            </Text>
            <Text size={2}>
              Your real site opens. Click any words or picture on it, change them on the right, then press
              Publish. The live site updates within about a minute.
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} border>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              2. All content (this list)
            </Text>
            <Text size={2}>Every screen of the site, sorted by what you would want to do:</Text>
          </Stack>
        </Card>

        <Stack space={3}>
          {TASKS.map(([task, where]) => (
            <Card key={task} padding={3} radius={2} border>
              <Stack space={2}>
                <Text size={2} weight="medium">
                  {task}
                </Text>
                <Text size={1} muted>
                  {where}
                </Text>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Card padding={4} radius={3} tone="caution" border>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Nothing goes live until you press Publish
            </Text>
            <Text size={2}>
              Changes save as a draft while you type, so you can stop halfway and come back. Every screen keeps
              its history, so any published change can be undone.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
