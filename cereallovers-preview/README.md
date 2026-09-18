# Cereal Lovers 2026 — private preview

Two versions of a new cereallovers.lu, for internal review only.
Plain HTML, CSS, images and fonts. No build step, no dependencies, no database.

| file | what it is |
|---|---|
| `index.html` | the front door: two buttons |
| `a.html` | **Option A, Ink** — cream paper ground, colour in the marks |
| `b.html` | **Option B, Loud** — every section a full brand colour |
| `hands.html` | nine handwriting faces, to settle which pen the site uses |
| `img/` `mg/` `el/` `thumb/` | photographs, PP Migra outlines cut to SVG, toolbox elements, thumbnails |
| `fonts/` `fonts.css` | the webfonts, served from this site, not from Google |
| `vercel.json` | clean URLs (`/a` instead of `/a.html`), caching, no-index headers |
| `robots.txt` | tells search engines to stay away |

Both options have the same seven stops: Ouverture, Les produits, Les héros,
La carte, Le mur, La maison, Finale. There is no menu bar. The round red mark
in the bottom right corner is the navigation.

---

## Step 1 — put it on GitHub

1. Go to **github.com → New repository**.
2. Name it `cereallovers-preview`. Choose **Private**.
   Do **not** tick "Add a README", "Add .gitignore" or "Choose a license". This folder already has them.
3. Click **Create repository**.
4. On the empty repository page, click the link **"uploading an existing file"**.
5. Open the `cereallovers-preview` folder on your Desktop. Select **everything inside it**
   (`Cmd + A`) — the files and the folders, *not* the outer folder itself — and drag them
   into the browser window. Wait until all of them appear.
6. Scroll down, click **Commit changes**.

If `.gitignore` does not appear when you select all, that is only macOS hiding files that start
with a dot. Press `Cmd + Shift + .` in Finder to show them, or skip it. Nothing breaks.

## Step 2 — put it on Vercel

1. Go to **vercel.com** and log in **with GitHub**.
2. **Add New → Project**.
3. Find `cereallovers-preview` and click **Import**.
   If it is not listed, click "Adjust GitHub App Permissions" and give Vercel access to it.
4. On the configure screen, leave everything alone except:
   - **Framework Preset:** `Other`
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
   - **Root Directory:** `./`
5. Click **Deploy**. Under a minute.
6. You get a URL like `https://cereallovers-preview-a1b2c3.vercel.app`. That is the link.

## Step 3 — check it before you send it

Open the link on a laptop and on your phone, then check these four pages load:

```
/          the two buttons
/a         Option A, Ink
/b         Option B, Loud
/hands     the handwriting
```

Scroll each option all the way down. The ink lines draw themselves as you go.

## Step 4 — send one link

Send your boss the Vercel URL. Nothing to install, nothing to log in to.

---

## Things worth knowing

**It is not on Google.** Every page carries a `noindex` tag, `robots.txt` blocks crawlers, and
Vercel sends an `X-Robots-Tag` header.

**It is still public to anyone with the link.** There is no password. Vercel's password
protection is a paid feature (Settings → Deployment Protection). For a weekend review an
unindexed link is normally enough. Do not post it anywhere.

**No third-party requests.** The fonts are served from this site, not from Google Fonts.
Nothing about a visit leaves Vercel. One less thing to think about under GDPR.

**Updating it.** Change a file in GitHub and Vercel redeploys on its own within a minute.
Every deploy keeps its own permanent URL, so an older version is never lost.

**Your own address later.** Vercel → Settings → Domains lets you point something like
`preview.cereallovers.lu` at it. That needs a DNS record from whoever runs the domain.

**The live site is untouched.** Nothing here writes to www.cereallovers.lu.

## Photography

All shop photographs were graded with one consistent recipe: gentle white balance, black point,
shadow lift, a soft contrast curve, local contrast and +28% saturation. The same numbers on every
frame, so the set reads as one shoot rather than fifteen phone pictures.

The three coffee packs in **Les héros** are the original cut-outs on transparent background,
edge-cleaned and doubled in resolution. They are the only studio images on the site; everything
else was shot in the shop.

No prices appear anywhere. Frames that showed the price board or a chalk tag were cropped so the
numbers fall outside the picture.

## Fonts and licences

| face | used for | licence |
|---|---|---|
| Neue Haas / Helvetica | all the large type | falls back to Helvetica or Arial on the viewer's machine |
| PP Migra Italic | the display words: *The Epicurean Collection*, *Cœur*, *Colombia*, *Menu* | **not shipped as a font.** Each word was cut from the brand PDF into an SVG outline, so there is no web licence to buy |
| Mansalva | the handwritten statements | SIL Open Font License, free commercially |
| Just Another Hand | the small red margin notes | SIL Open Font License, free commercially |

The seven extra faces in `fonts/` exist only for `hands.html`, the comparison page. All Open Font
License as well.
