# The share card

`scripts/og-card.html` is the source for `public/og.png` (the card when the
site link is texted or posted) and `public/og-book.png` (the /book page).

Regenerate (from `site/`):

    mkdir -p /tmp/og && cp scripts/og-card.html /tmp/og/index.html
    ln -sf "$PWD/public/wall" /tmp/og/wall && ln -sf "$PWD/public/brand" /tmp/og/brand
    (cd /tmp/og && python3 -m http.server 3412 &)
    CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --window-size=1200,630 --virtual-time-budget=8000 \
      --screenshot=public/og.png "http://localhost:3412/index.html"
    "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --window-size=1200,630 --virtual-time-budget=8000 \
      --screenshot=public/og-book.png "http://localhost:3412/index.html?v=book"

Never put the html in `public/`: everything there is served.
Messages and Instagram cache link previews, so a new card can take a while to
show on a link that was already sent.
