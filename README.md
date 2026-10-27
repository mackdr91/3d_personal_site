# 3D Atelier — Art Gallery Studio & Personal Portfolio

An interactive 3D personal website and art gallery studio built with **React**, **Three.js** (`@react-three/fiber` & `@react-three/drei`), and **Vite**.

Designed for **Domonick Mack** (Navy Veteran, Datacenter Technician L2, SysAdmin / Network Engineer & Full-Stack AI Developer).

---

## Features

- **Sunlit Loft Studio**: 3D architectural loft with warm oak flooring, natural skylight illumination, timber ceiling beams, kinetic sculptures, and terracotta planters.
- **I · Digital Drawings Atelier (North Wall & Easel)**: Framed digital illustrations and a studio wooden easel with high-resolution lightbox inspection and palette swatches.
- **II · GitHub Systems & Code Exhibition (East Wall)**: 3D interactive repository frames synchronized live with the GitHub API (`@mackdr91`), equipped with a 3D exhibition pager.
- **III · Curriculum Vitae "Art on the Wall" (West Wall)**: Framed typographic prints detailing professional experience (Google Datacenter L2, Penske L3 SysAdmin, US Navy IT Supervisor), plus 3D brass plaques for technical skills and certifications.
- **IV · Artist Desk & Contact Lounge (South Area)**: Architect's walnut drafting table, open two-page guestbook, direct email copy, and dispatch form.
- **Guided Camera Waypoints & Free Orbit**: Bottom dock navigation (1–5), arrow keys, and click-to-focus on any artwork or exhibit.
- **Studio Lighting Moods**: Real-time toggle between *Sunlit Day* and *Golden Hour Loft*.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D & Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`, `camera-controls`
- **Icons & Styling**: Lucide React, Modern CSS (Native top-layer `<dialog>` with discrete transitions and `@starting-style`)
- **API**: GitHub REST API (with client caching and graceful offline fallbacks)

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
