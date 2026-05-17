---
name: Olfactory Enterprise
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#121212'
  on-primary-container: '#7e7d7d'
  inverse-primary: '#5f5e5e'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#c9c6c3'
  on-tertiary: '#31302f'
  tertiary-container: '#121211'
  on-tertiary-container: '#7f7d7b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2df'
  tertiary-fixed-dim: '#c9c6c3'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484745'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

The design system is a fusion of **High-End Luxury Editorial** and **Modern SaaS Minimalism**. It is designed to feel like a digital extension of a premium fragrance boutique—intentional, spacious, and sophisticated. The interface prioritizes clarity and efficiency for high-volume CRM data while maintaining the aesthetic prestige associated with luxury perfume brands like Le Labo and Byredo.

The visual direction utilizes a "Digital Ateliers" style:
- **Minimalism:** Aggressive use of whitespace to prevent cognitive overload.
- **Glassmorphism:** Strategic use of backdrop blurs for navigation and overlays to create a sense of depth and material quality.
- **Editorial Precision:** High-contrast typography and razor-sharp alignment inspired by boutique print catalogs.
- **Tactile Refinement:** Subtle, soft shadows that mimic natural studio lighting rather than digital depth.

## Colors

The palette is anchored in a high-contrast dark mode, mirroring the "Noir" aesthetic of luxury packaging.

- **Primary (Deep Charcoal):** `#121212` – Used for primary backgrounds and surfaces to create a void-like depth.
- **Secondary (Aged Gold):** `#D4AF37` – A sophisticated metallic used sparingly for primary actions, success states, or premium indicators.
- **Tertiary (Soft Alabaster):** `#F7F3F0` – Used for primary text and high-contrast UI elements to ensure legibility against the charcoal base.
- **Neutral (Graphite):** `#2A2A2A` – Used for secondary containers, borders, and input backgrounds to provide soft structural separation.

The system supports a **high-contrast dark mode** by default, where pure whites are avoided in favor of "Alabaster" to reduce eye strain while maintaining a premium feel.

## Typography

Typography follows a strict hierarchy of **Refined Serif** for storytelling/headers and **Technical Sans** for utility.

- **Headlines:** Playfair Display provides an authoritative, literary feel. Use for page titles, section headers, and "Hero" metrics.
- **Body & UI:** Geist is used for its technical precision and readability in data-heavy environments. Its monospaced-influence ensures that numerical data in the CRM aligns perfectly.
- **Labels:** Labels use Geist with increased letter spacing and uppercase styling to mimic the typographic layout of perfume bottle labels.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with fixed maximum widths for content readability.

- **Grid Model:** 12-column layout for desktop with 24px gutters.
- **Spacing Rhythm:** Based on an 8px base unit. Generous padding (32px+) is required around major containers to maintain the minimalist aesthetic.
- **Mobile Adaptation:** At the 768px breakpoint, the grid collapses to 4 columns, margins reduce to 16px, and Serif headlines scale down by 25% to maintain visual balance.
- **Sidebars:** Fixed 280px width using a glassmorphic blur (Backdrop Filter: 20px) to allow background colors to bleed through subtly.

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Glassmorphism** rather than heavy drop shadows.

- **Base Layer:** Deep Charcoal (`#121212`).
- **Surface Layer:** Neutral Graphite (`#2A2A2A`) with a subtle 1px border (`rgba(255,255,255,0.1)`).
- **Overlays/Sidebars:** Semi-transparent Graphite (`rgba(42, 42, 42, 0.7)`) with a `blur(20px)` effect.
- **Shadows:** Only used on floating elements (Modals, Popovers). Use "Ambient Shadows": `0px 10px 30px rgba(0, 0, 0, 0.5)`.

## Shapes

The shape language is controlled and modern. 

- **Primary Radius:** 0.5rem (8px) for buttons, inputs, and small cards.
- **Large Radius:** 1rem (16px) for main dashboard containers and modal windows.
- **Interactive Elements:** Buttons should feel substantial but never fully pill-shaped, maintaining a architectural silhouette.

## Components

- **Buttons:** 
  - *Primary:* Solid Aged Gold text on a Ghost background with a Gold border. 
  - *Secondary:* Alabaster text on a subtle Graphite background.
  - *Interaction:* Subtle scale down (0.98) on click for a tactile feel.
- **Data Tables:** Row-based layout with no vertical borders. Use 1px horizontal dividers in `rgba(255,255,255,0.05)`. Hover states should use a subtle lightening of the background.
- **Input Fields:** Bottom-border only (Editorial style) or fully enclosed with an 8px radius. Use Geist for input text to ensure numerical alignment.
- **Charts:** Use a monochromatic scale of the Gold accent. Lines should be thin (1.5px) with no grid lines on the X/Y axes to keep the "Minimalist" look.
- **Sleek Sidebar:** Vertical navigation using the Label-MD type style. Icons should be "Light" weight (2px stroke) to match the elegance of Playfair Display.
- **Chips/Status:** Small, all-caps Geist text with a very low-opacity background tint (e.g., Success = Gold at 10% opacity).