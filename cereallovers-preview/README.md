# Cereal Lovers 2026 — private preview


> **Now (7 Oct 2026): the site shows one version only, Option B Louder, at the home page `/`.**
> Old addresses (`/b`, `/a`, `/b-september`, `/hands`, `/costs`) redirect to it (see `vercel.json`).
> The other versions and the costs page are kept on the Desktop in `website-2026/preview-other-versions/`
> and in the GitHub history, so any of them can go back up in a minute.

Two versions of a new cereallovers.lu, for internal review only.
Plain HTML, CSS, images and fonts. No build step, no dependencies, no database.

| file | what it is |
|---|---|
| `index.html` | the home page: Option B, Louder (the only page on the live site now) |
| `a.html` (kept aside) | **Option A, Ink** — cream paper ground, colour in the marks |
| `b-september.html` (kept aside) | **Option B, Loud**, the September version — every section a full brand colour |
| `hands.html` (kept aside) | nine handwriting faces, to settle which pen the site uses |
| `img/` `mg/` `el/` `thumb/` | photographs, PP Migra outlines cut to SVG, toolbox elements, thumbnails |
| `fonts/` `fonts.css` | the webfonts, served from this site, not from Google |
| `vercel.json` | clean URLs (`/a` instead of `/a.html`), caching, no-index headers |
| `robots.txt` | tells search engines to stay away |

## New, October 2026: Option B pushed further (the home page)

`b.html` is now Option B with the volume up and the barista courses first. The September version
of Option B is kept at `b-september.html` (`/b-september`). The front page shows the new one first,
and `costs.html` explains what running it would cost.

| file | what it is |
|---|---|
| `index.html` | **Option B, Louder**, the home page. Courses first, a "send me more info" note at the top, the four granolas as their jar labels, three coffees, bars, cookies |
| `courses.json` | **the only file to edit to keep the courses fresh** |
| `costs.html` | hosting, sign-up and upkeep costs, for the decision |
| `img/b2/` | the new photographs, graded and cropped (no faces, no price tags). `img/b2/bars/` holds the six studio bars, cut out with Adobe |
| `img/bags/coffee-n16–18.webp` | the three coffee bags, drawn clean from the real labels (front view, transparent background). Used by Option A and both Option B pages |
| `mg/n1–n4.svg` | the N°1–N°4 granola numerals in Migra, cut from the toolbox. N° numbers are used only on the products they belong to; the menu uses words |

### Keeping the course dates fresh

Open `courses.json` on GitHub, click the pencil, change it, click **Commit changes**. Vercel
publishes it within a minute.

- Each date is one line under `"sessions"`. Dates are written `2026-10-24`. A professional
  course over two mornings gets a `"start"` and an `"end"`.
- A session disappears by itself the day after it ends. Nothing old ever shows.
- Change `"updated"` to today's date whenever you edit. It is printed on the page.
- `"show_prices": true` shows the `"price"` of each session. It is `false` now, as everywhere else.
- Course descriptions, photos and the yellow ticker lines are in the same file.
- So are the city's big days (`"events"`, from the Cityshopping Luxembourg 2027 calendar). Same rule: an event drops off the day after it ends. Add next year's dates the same way.

Keep the commas and quotes exactly as they are. If the page says "the course list did not load",
a comma is missing. GitHub shows a red mark on the line.

### The "send me more info" note

It works now at no cost: "send it" opens the visitor's email app with the note written to
hello@cereallovers.lu. To have notes arrive by themselves instead, make a free Formspree form,
copy its link (it looks like `https://formspree.io/f/abcdwxyz`) and paste it between the quotes of
`"endpoint"` in `courses.json`. The form asks for consent. Add a short privacy note before it goes
on the real domain.

### Where the files live on GitHub

In the repository the site sits inside a folder also called `cereallovers-preview`. Edit or upload
files inside that folder, not at the top level, or Vercel will not see them.

---

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
