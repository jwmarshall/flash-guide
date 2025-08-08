import { NextRequest, NextResponse } from 'next/server'

interface PowerRequest {
  guide_number: number
  iso: number
  power_ratios: number[]
  f_stops: number[]
  units: 'meters' | 'feet'
}

export async function POST(request: NextRequest) {
  try {
    const body: PowerRequest = await request.json()
    const { guide_number, iso, power_ratios, f_stops, units } = body

    // Validate inputs
    if (!guide_number || !iso || !power_ratios || !f_stops) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Calculate distances for each power ratio and f-stop combination
    const data: number[][] = []
    const rowHeaders: string[] = []
    const columnHeaders: string[] = f_stops.map(f => f.toString())

    const isoFactor = Math.sqrt(iso / 100)

    for (const powerRatio of power_ratios) {
      const powerFactor = Math.sqrt(1 / powerRatio) // 1/1, 1/2, 1/4, etc.
      const adjustedGN = guide_number * isoFactor * powerFactor
      const distances: number[] = []
      
      for (const fstop of f_stops) {
        let distance = adjustedGN / fstop
        
        // Convert to feet if requested
        if (units === 'feet') {
          distance = distance * 3.28084
        }
        
        distances.push(Math.round(distance * 10) / 10) // Round to 1 decimal
      }
      
      data.push(distances)
      rowHeaders.push(powerRatio.toString())
    }

    return NextResponse.json({
      data,
      rowHeaders,
      columnHeaders,
      units,
      mode: 'power'
    })
  } catch (error) {
    console.error('Error in power calculation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
