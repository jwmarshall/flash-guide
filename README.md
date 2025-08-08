# Flashly

A flash exposure calculator for film photographers. Calculate optimal flash distances based on guide numbers, ISO values, and aperture settings.

## Features

- **Dual Calculation Modes**
  - **ISO Mode**: Calculate flash distances across multiple ISO values
  - **Power Mode**: Calculate distances for different flash power settings at a fixed ISO

- **Interactive Interface**
  - Real-time calculations with customizable f-stop ranges
  - Support for full, half, and third stop increments
  - Quick ISO preset buttons for common film speeds

- **Data Visualization**
  - Tabular view with copy-to-clipboard functionality
  - Interactive line charts showing distance relationships
  - Print-friendly output

- **Unit Support**
  - Calculate in meters or feet
  - Automatic unit conversion

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flashly.git
cd flashly

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
pnpm run build
pnpm run start
```

## How It Works

Flashly uses the standard flash guide number formula to calculate optimal distances:

- **Base Formula**: `Distance = Guide Number / F-stop`
- **ISO Adjustment**: `Adjusted GN = GN × √(ISO/100)`
- **Power Adjustment**: `Adjusted GN = GN × √(1/power_ratio)`

### Guide Number

The guide number (GN) is a standardized measurement of a flash unit's power output at ISO 100. Common guide numbers:

- Small built-in flash: GN 12-20
- Compact external flash: GN 20-36
- Professional flash: GN 36-60+

## Usage

1. **Enter your flash's guide number** (at ISO 100)
2. **Select calculation mode**:
   - ISO mode: Enter comma-separated ISO values (e.g., 100, 200, 400, 800)
   - Power mode: Select a fixed ISO and view distances at different power ratios
3. **Set your f-stop range** using the min/max controls
4. **Choose your preferred units** (meters or feet)
5. **Click "Calculate Flash Distances"** to generate results

The results show the maximum effective flash distance for proper exposure at each combination of settings.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization

## Project Structure

```
flashly/
├── app/
│   ├── api/
│   │   ├── iso/         # ISO-based calculations
│   │   └── power/       # Power-based calculations
│   ├── page.tsx         # Main application UI
│   └── layout.tsx       # Root layout
├── components/
│   ├── flash-table.tsx  # Results table component
│   ├── flash-chart.tsx  # Results chart component
│   └── ui/              # Reusable UI components
└── public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).