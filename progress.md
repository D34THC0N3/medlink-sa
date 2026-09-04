# MedLink SA — Visual Overhaul Progress

## Completed
- [x] Branch `visual-overhaul` created
- [x] Global tokens/theme overhaul — OKLCH palette (cool-tinted neutrals, hue 255), 4pt spacing scale, shadow/transition tokens, reduced-motion support
- [x] Remove AI slop — glass/glow/gold/gradient classes purged from globals.css, all cleaned in JSX
- [x] Typography — Plus Jakarta Sans replaces Inter; variable `--font-body`
- [x] Logo fix — medical cross/plus SVG (not "Z"); favicon.svg created
- [x] Dashboard header condensed to "MEDLINK-SA"
- [x] Page transitions — framer-motion `AnimatePresence` via `PageTransition` component wired into `layout.tsx`
- [x] Custom 404 — `not-found.tsx` (server) + `not-found-content.tsx` (client with animation)
- [x] SEO — robots.ts, sitemap.ts, llms.txt, per-route layouts with unique metadata, canonical tags, JSON-LD
- [x] Production hardening — `productionBrowserSourceMaps: false`, `poweredByHeader: false`, AVIF/WebP images
- [x] Input cleanup — `input-premium` removed; `input-wrapper` removed; shadcn `<Input>` used where needed
- [x] Dead exports removed — `LANGUAGES`, `PAIN_POINTS`, `DOCTOR_HIGH_RISK`, `ADMIN_AUDIT`; `Facility`, `QueueTicket` un-exported
- [x] Dead Prisma singleton deleted; `src/lib/db.ts` restored
- [x] Component polish — tighter spacing, consistent padding across navbar, footer, dashboard layout
- [x] Build verified clean — TypeScript OK, 34 static pages generated

## In Progress
- [ ] Full responsiveness: phones, tablets, desktops, large screens
- [ ] Dashboard sidebar: collapsible/uncollapsible for mobile
- [ ] Dark mode cleanup (consistent palette, no gradient overuse)
- [ ] Text animations (framer-motion) — hero, section headings
- [ ] Final review & critique loop

## Deferred
- NHSSS data validation
- PTV workflow
- Database integration (last)
