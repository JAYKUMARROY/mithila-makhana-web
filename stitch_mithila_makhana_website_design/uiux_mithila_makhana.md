# 🎨 UI/UX Design Document
# **Mithila Makhana Platform**

---

## 1. Brand Identity & Design Philosophy

**Vibe:** Premium, Authentic, Earthy, Trustworthy.
The design must reflect the rich cultural heritage of the Mithila region (Madhubani art influences) while maintaining a modern, clean, and premium e-commerce experience suitable for selling a GI-tagged superfood.

---

## 2. Design System / Style Guide

### 2.1 Color Palette
Inspired by roasted makhana, earth, and traditional Mithila art.

*   **Primary Brand Color:** `Earthy Gold` (#D4AF37) - Used for primary CTAs, active states, highlighting.
*   **Secondary Color:** `Deep Forest Green` (#2C4C3B) - Used for headers, footers, establishing trust and "organic" feel.
*   **Accent Color:** `Terracotta/Vermillion` (#E05A47) - Used sparingly for sale tags, error states, notification badges.
*   **Background (Light):** `Off-White/Cream` (#FDFBF7) - Primary background, softer than stark white.
*   **Text (Dark):** `Charcoal` (#1F2937) - Primary text.

### 2.2 Typography
*   **Headings (H1-H6):** `Outfit` or `Poppins` (Sans-serif, modern, slightly geometric).
*   **Body Text:** `Inter` (Highly readable, clean, modern).

### 2.3 UI Elements
*   **Border Radius:** `8px` (Slightly rounded, modern but not overly playful).
*   **Shadows:** Soft, subtle drop shadows to create depth on product cards and modals, avoiding harsh lines.
*   **Icons:** `Lucide React` or `Phosphor Icons` (Clean, consistent line weight).

---

## 3. Component Library

### 3.1 Buttons
*   **Primary:** Solid `Earthy Gold` background, dark text. (e.g., "Add to Cart", "Checkout")
*   **Secondary:** Solid `Deep Forest Green` background, white text. (e.g., "View Details")
*   **Outline:** Transparent background, `Deep Forest Green` border.
*   **States:** Hover (slightly darker shade), Disabled (opacity 50%, unclickable).

### 3.2 Product Card
*   **Layout:** Image on top (square ratio, light grey background), Title (bold), Price (Gold color), Variants (small pills if applicable), "Add to Cart" full-width button at bottom.
*   **Tags:** "Bestseller", "GI Tagged" as small badges overlaid on the top-left of the image.

---

## 4. Page Wireframes (ASCII)

### 4.1 Customer Website - Homepage

```text
=======================================================================
[Logo: Mithila Makhana]     Shop   Story   Blog         [Search] [Cart(2)]
=======================================================================

+---------------------------------------------------------------------+
|                                                                     |
|                      PREMIUM MITHILA MAKHANA                        |
|             Direct from the farms of Bihar to your home.            |
|                                                                     |
|                       [ SHOP THE COLLECTION ]                       |
|                                                                     |
+---------------------------------------------------------------------+
   [Badge: GI Tagged]       [Badge: 100% Organic]       [Badge: FSSAI]

--- BESTSELLERS -------------------------------------------------------
 [ Product Image ]   [ Product Image ]   [ Product Image ]   [ Product Image ]
 Raw Phool Makhana   Roasted Peri Peri   Caramel Crunch      Makhana Gift Box
 ₹399                ₹149                ₹159                ₹999
 [ Add to Cart ]     [ Add to Cart ]     [ Add to Cart ]     [ Add to Cart ]

--- OUR STORY ---------------------------------------------------------
 [ Image: Harvesting Makhana ]
 Discover the centuries-old tradition of Makhana cultivation...
 [ Read More ]
```

### 4.2 Customer Website - Product Detail Page (PDP)

```text
=======================================================================
Home > Shop > Roasted Snacks > Peri Peri Makhana
=======================================================================

+---------------------+  ROASTED PERI PERI MAKHANA
|                     |  ⭐⭐⭐⭐⭐ (124 Reviews)
|    [ Main Image ]   |
|                     |  Price: ₹149.00
|                     |
+---------------------+  Size:
[Img1] [Img2] [Img3]     [ 100g ]  [ 250g ]  [ 500g ]

                         Quantity: [-] 1 [+]

                         [ ADD TO CART - ₹149 ]
                         [ BUY IT NOW ]

                         Description:
                         Crunchy, spicy, and tangy. Perfectly roasted...
                         
                         Nutritional Info:
                         Protein: 9g | Calories: 347 kcal
```

### 4.3 Admin Dashboard - Overview

```text
=======================================================================
[Logo Admin] | Dashboard | Products | Orders | Inventory |  [👤 Admin User]
=======================================================================
Dashboard Overview                                        [Date Filter v]

+-----------------+ +-----------------+ +-----------------+ +-----------+
| Total Revenue   | | Orders Today    | | New Customers   | | Low Stock |
| ₹ 24,500        | | 42              | | 15              | | 3 Items   |
| ^ 12% vs last wk| | ^ 5% vs last wk | |                 | | [View]    |
+-----------------+ +-----------------+ +-----------------+ +-----------+

Recent Orders
ID       Customer      Date       Amount    Status       Action
#1042    Rahul S.      Today      ₹1,250    [Pending]    [Process]
#1041    Anita D.      Today      ₹450      [Shipped]    [View]
#1040    Bulk Co.      Yesterday  ₹15,000   [Delivered]  [View]

Top Selling Products (This Week)
1. Premium Raw Makhana (500g) - 120 units
2. Peri Peri Roasted (100g) - 85 units
```

---

## 5. Responsive Design Strategy

We will use a **Mobile-First** approach.

*   **Mobile (< 768px):** Hamburger menu for navigation. Product grids stack vertically (1 column). Filter options become a slide-out bottom drawer. Sticky "Add to Cart" bar at the bottom of the screen on Product Detail pages.
*   **Tablet (768px - 1024px):** 2 or 3 column grids for products.
*   **Desktop (> 1024px):** Full navigation bar. 4 column grids for products. Sidebars visible.

---

## 6. Interaction Design & UX Principles

*   **Add to Cart Action:** Should not reload the page. A slide-out cart drawer opens from the right side providing immediate feedback, allowing the user to checkout or continue shopping.
*   **Loading States:** Use skeleton loaders instead of spinning wheels for content areas (like product lists) to make the app feel faster.
*   **Empty States:** If a cart is empty, or a search yields no results, show a friendly illustration and a clear "Continue Shopping" CTA.
*   **Trust Signals:** Prominently display secure checkout icons, return policies, and the GI Tag/FSSAI badges near the "Buy" buttons to increase conversion.
