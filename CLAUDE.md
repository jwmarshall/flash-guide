# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Run
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Package Management
This project uses pnpm. Install dependencies with `pnpm install`.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with dark theme
- **Charts**: Recharts for data visualization
- **Form Handling**: react-hook-form with zod validation
- **Language**: TypeScript with strict mode enabled

### Application Structure

**Flashly** is a flash exposure calculator for film photographers that calculates flash distances based on guide numbers and camera settings.

#### Core Features
1. **ISO-based calculations**: Calculate flash distances for multiple ISO values at various f-stops
2. **Power-based calculations**: Calculate flash distances for different flash power ratios at a fixed ISO
3. **Data visualization**: Display results in both table and chart formats
4. **Unit conversion**: Support for both meters and feet

#### API Routes
- `/api/iso/route.ts`: Handles ISO-based flash distance calculations
  - Accepts: guide_number, iso_values[], f_stops[], units
  - Returns: distance matrix with row/column headers
  
- `/api/power/route.ts`: Handles power-based flash distance calculations  
  - Accepts: guide_number, iso, power_ratios[], f_stops[], units
  - Returns: distance matrix with row/column headers

#### Key Components
- `app/page.tsx`: Main application UI with form inputs and state management
- `components/flash-table.tsx`: Displays calculation results in table format with copy/print functionality
- `components/flash-chart.tsx`: Visualizes results using line charts

#### Flash Calculation Formula
- Base formula: Distance = Guide Number / F-stop
- ISO adjustment: Adjusted GN = GN × √(ISO/100)
- Power adjustment: Adjusted GN = GN × √(1/power_ratio)

### Path Aliases
The project uses `@/*` path alias that maps to the root directory, configured in tsconfig.json.