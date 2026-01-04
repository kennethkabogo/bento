# Bento Clone - Link in Bio

A modern, interactive "link in bio" page inspired by Bento, featuring a modular grid layout, drag-and-drop customization, and premium design aesthetics.

## Features

- **Responsive Design** – Beautiful on desktop, tablet, and mobile
- **Drag & Drop** – Rearrange tiles to customize your layout
- **LocalStorage Persistence** – Your layout is saved automatically
- **Cursor Glow Effect** – Subtle interactive visual effects
- **Rich Content** – Support for social links, images, embeds (Spotify, YouTube)
- **Zero Dependencies** – Pure HTML, CSS, and JavaScript
- **Production Ready** – Deploy to GitHub Pages instantly

## Live Demo

Visit the live site: https://kennethkabogo.github.io/bento/

## Usage

### Opening Locally

```bash
# Landing page
open index.html

# Profile page
open profile.html
```

### Edit Mode

1. Click the **"Edit"** button in the bottom-right corner
2. Drag tiles to rearrange them
3. Click **"Done"** to save your layout
4. Click **"Reset"** to restore the default layout

### Customization

**Update your profile information:**
- Edit `profile.html` to change your name, bio, and location
- Replace images in `assets/images/` with your own photos

**Add/remove tiles:**
- Open `profile.html`
- Add or remove `<a>` or `<div>` elements with class `tile`
- Use classes like `tile-1x1`, `tile-2x1`, `tile-1x2`, `tile-2x2` for sizing

**Change colors:**
- Edit `css/design-system.css`
- Modify CSS custom properties in `:root`

## Project Structure

```
bento/
├── index.html              # Landing page
├── profile.html            # Main profile page
├── script.js               # Interactive features (drag & drop, cursor glow)
├── css/
│   ├── design-system.css   # Design tokens and variables
│   └── components.css      # Component styles
├── js/
│   └── interactions.js     # Page interactions
└── assets/
    └── images/             # Profile images
```

## Design Features

- **Glass-morphism** – Subtle backdrop blur effects
- **Smooth Animations** – Polished transitions on all interactions
- **Gradient Accents** – Strategic use of purple gradients
- **Dark Theme** – Modern dark color scheme
- **Custom Typography** – Inter font family

## Deployment

### GitHub Pages

This site is deployed using GitHub Pages:
1. Push to GitHub (already done!)
2. Go to **Settings** → **Pages**
3. Set **Source** to `main` branch, `/ (root)` folder
4. Save and wait for deployment
5. Visit `https://yourusername.github.io/bento/`

## Credits

Inspired by Bento – a Link in Bio, but Rich and Beautiful.

---

Designed by [Kenneth Kabogo](https://github.com/kennethkabogo)
