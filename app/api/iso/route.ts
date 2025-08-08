import { NextRequest, NextResponse } from 'next/server'

interface IsoRequest {
  guide_number: number
  iso_values: number[]
  f_stops: number[]
  units: 'meters' | 'feet'
}

export async function POST(request: NextRequest) {
  try {
    const body: IsoRequest = await request.json()
    const { guide_number, iso_values, f_stops, units } = body

    // Validate inputs
    if (!guide_number || !iso_values || !f_stops) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Calculate distances for each ISO and f-stop combination
    const data: number[][] = []
    const rowHeaders: string[] = []
    const columnHeaders: string[] = f_stops.map(f => f.toString())

    for (const iso of iso_values) {
      const adjustedGN = guide_number * Math.sqrt(iso / 100)
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
      rowHeaders.push(iso.toString())
    }

    return NextResponse.json({
      data,
      rowHeaders,
      columnHeaders,
      units,
      mode: 'iso'
    })
  } catch (error) {
    console.error('Error in ISO calculation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
