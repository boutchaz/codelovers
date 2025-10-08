# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 web application for **wearecodelovers**, a web agency. Built with:
- Next.js 15.5.4 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Turbopack for faster builds
- ESLint for code quality

## Development Commands

**Start development server:**
```bash
npm run dev
```
Server runs at http://localhost:3000 with Turbopack enabled for fast refresh.

**Build for production:**
```bash
npm run build
```
Uses Turbopack for optimized builds.

**Start production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

**Extract frames from video (for scroll animations):**
```bash
npm run extract-frames
```
Extracts frames from `public/animate.mp4` to `public/frames/` for GSAP scroll animations. See [scripts/README.md](scripts/README.md) for details.

## Architecture

**App Router Structure:**
- `app/` - Main application directory using Next.js App Router
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Home page component
- `app/globals.css` - Global Tailwind styles
- `public/` - Static assets

**Path Aliases:**
- `@/*` maps to root directory (e.g., `@/components/Button`)

**TypeScript Configuration:**
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler

**Styling:**
- Tailwind CSS v4 with PostCSS
- Custom fonts: Geist Sans and Geist Mono (automatically optimized)

## Key Technical Details

- **Framework:** Next.js 15 with App Router (not Pages Router)
- **Rendering:** Uses React Server Components by default
- **Turbopack:** Enabled for both dev and build (faster than Webpack)
- All components in `app/` are Server Components unless marked with `'use client'`
