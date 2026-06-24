---
name: Heritage Hearth
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4d4635'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#456553'
  on-secondary: '#ffffff'
  secondary-container: '#c4e8d1'
  on-secondary-container: '#496a57'
  tertiary: '#ab3425'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff9685'
  on-tertiary-container: '#871a0e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#c7ebd4'
  secondary-fixed-dim: '#abcfb8'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#2d4d3c'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410100'
  on-tertiary-fixed-variant: '#8a1c10'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  charcoal-text: '#1F2937'
  cream-bg: '#FDFBF7'
  gold-accent: '#D4AF37'
  forest-deep: '#2C4C3B'
  vermillion-clay: '#E05A47'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is a "Modern Heritage" aesthetic that bridges the gap between ancient Mithila traditions and premium global e-commerce. It targets health-conscious, culturally aware consumers who value authenticity and high-quality "superfoods."

The visual style is **Corporate / Modern** with a **Minimalist** foundation, enriched by **Madhubani-inspired** geometric patterns and a tactile, earthy texture. The interface must feel grounded and trustworthy (Deep Forest Green) while exuding a sense of premium value (Earthy Gold). The use of high-quality whitespace and professional typography prevents the cultural elements from feeling "cluttered" or "rustic," positioning the product as a luxury health staple.

- **Tone:** Authentic, Premium, Nutritional, Earthy.
- **Visual Style:** Clean layouts, structured grids, and subtle cultural motifs used as decorative accents rather than dominant elements.

## Colors

The palette is derived from the natural elements of the Mithila region and the makhana cultivation process.

- **Primary (Earthy Gold):** Represents the premium nature of the "Fox Nut" and the richness of harvest. Use for high-priority CTAs and key brand moments.
- **Secondary (Deep Forest Green):** Evokes the aquatic environment where makhana grows. This is the "trust" color, used for headers and structural elements to ground the design.
- **Tertiary (Vermillion Clay):** Inspired by traditional Madhubani dyes and terracotta. Use strictly for emphasis, sales tags, and notifications to create a vibrant pulse.
- **Neutral (Cream/Charcoal):** The background should always be `#FDFBF7` to provide a warmer, more organic feel than pure white, paired with `#1F2937` for high-legibility text.

## Typography

This design system uses a dual-font strategy to balance character with utility.

- **Outfit (Headings):** A geometric sans-serif that feels modern and clean. Used for all headings (H1-H6) to provide a premium, structured look.
- **Inter (Body/UI):** Chosen for its exceptional readability at small sizes. Used for all descriptions, product details, and administrative data.

**Hierarchy Rules:**
- Use `display-lg` for hero sections with tight letter spacing.
- Use `label-lg` in All-Caps for badges and category headers to create a "premium stamp" effect.
- Maintain generous line heights for body text to ensure a comfortable reading experience for nutritional information.

## Layout & Spacing

The layout follows a **Fluid Grid** system based on an 8px base unit to ensure perfect alignment across all components.

- **Desktop:** 12-column grid with 24px gutters. Product listings should comfortably fit 4 cards per row.
- **Tablet:** 8-column grid. Product listings reflow to 2 or 3 cards per row.
- **Mobile:** 4-column grid with 16px side margins. Product listings stack in a single column or a tight 2-column grid for smaller items like snacks.

Spacing should be generous between sections (80px - 120px) to maintain the minimalist, premium vibe, allowing the imagery and "Off-White" background to breathe.

## Elevation & Depth

To maintain a modern e-commerce feel, depth is achieved through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

- **Surface Levels:** The base layer is `Cream-BG`. Cards and modals sit on a "Level 1" surface which is pure white (`#FFFFFF`) to pop against the cream background.
- **Shadow Character:** Use extremely soft, diffused shadows with a slight tint of `Deep Forest Green` (e.g., `rgba(44, 76, 59, 0.08)`) to make elements feel like they are floating naturally over the page. 
- **Interactive Depth:** Buttons should have a subtle 2px lift on hover, while product cards should slightly scale (1.02x) and deepen their shadow to indicate interactivity.

## Shapes

The shape language is "Soft-Modern." Elements use an 8px (`0.5rem`) corner radius to balance organic warmth with professional structure.

- **Standard Elements:** Buttons, input fields, and product cards use the base 8px radius.
- **Badges:** Use a "Pill" shape (fully rounded) for status tags like "Organic" or "Bestseller" to distinguish them from functional UI components.
- **Cultural Accents:** Small Madhubani-inspired line patterns can be used as subtle background masks on cards or as dividers between sections.

## Components

### Buttons
- **Primary:** Earthy Gold background with Charcoal text. High-contrast and clear.
- **Secondary:** Deep Forest Green with White text. Used for "View Details" or secondary actions.
- **Outline:** Deep Forest Green border (1px) with transparent background.

### Product Cards
- **Structure:** White background, 8px rounded corners, subtle green-tinted shadow.
- **Image:** Square ratio with a very light grey (`#F3F4F6`) inner container to frame the product.
- **Badges:** Overlaid in top-left (e.g., "GI Tagged" in Gold, "Organic" in Green).

### Badges & Tags
- **GI Tagged:** Earthy Gold pill with an icon.
- **Organic/FSSAI:** Deep Forest Green pill with white text.
- **Sale/Hot:** Vermillion Clay pill for high urgency.

### Input Fields
- Off-white background with a 1px border in a muted green-gray. Focus state should use a 2px Earthy Gold border.

### Lists & Tables (Admin)
- Clean, row-based layout with Charcoal text. Use alternating row tints of the `Cream-BG` for readability. Status chips (Pending, Shipped) follow the Badge styling.