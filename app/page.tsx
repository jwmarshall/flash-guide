'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, Camera, Zap } from 'lucide-react'
import { FlashTable } from '@/components/flash-table'
import { FlashChart } from '@/components/flash-chart'

interface CalculationResult {
  data: number[][]
  rowHeaders: string[]
  columnHeaders: string[]
  units: string
  mode: string
}

const ISO_PRESETS = [50, 100, 200, 400, 800, 1600]
const POWER_RATIOS = [1, 2, 4, 8, 16, 32, 64, 128]

export default function FlashGuideApp() {
  const [guideNumber, setGuideNumber] = useState<string>('32')
  const [isoValues, setIsoValues] = useState<string>('100,200,400,800')
  const [units, setUnits] = useState<'meters' | 'feet'>('meters')
  const [tableType, setTableType] = useState<'iso' | 'power'>('iso')
  const [fixedIso, setFixedIso] = useState<string>('100')
  const [minFStop, setMinFStop] = useState<string>('2')
  const [maxFStop, setMaxFStop] = useState<string>('16')
  const [stepSize, setStepSize] = useState<string>('1')
  const [showChart, setShowChart] = useState<boolean>(true)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const generateFStops = (min: number, max: number, step: number): number[] => {
    const fStops: number[] = []
    const standardFStops = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64]
    
    if (step === 1) {
      // Full stops
      return standardFStops.filter(f => f >= min && f <= max)
    } else if (step === 0.5) {
      // Half stops
      const halfStops = [1, 1.2, 1.4, 1.7, 2, 2.4, 2.8, 3.3, 4, 4.8, 5.6, 6.7, 8, 9.5, 11, 13, 16, 19, 22, 27, 32, 38, 45, 54, 64]
      return halfStops.filter(f => f >= min && f <= max)
    } else {
      // Third stops
      const thirdStops = [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32]
      return thirdStops.filter(f => f >= min && f <= max)
    }
  }

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const fStops = generateFStops(parseFloat(minFStop), parseFloat(maxFStop), parseFloat(stepSize))
      
      const payload = {
        guide_number: parseFloat(guideNumber),
        f_stops: fStops,
        units
      }

      let endpoint = '/api/iso'
      if (tableType === 'iso') {
        Object.assign(payload, {
          iso_values: isoValues.split(',').map(iso => parseInt(iso.trim())).filter(iso => !isNaN(iso))
        })
      } else {
        endpoint = '/api/power'
        Object.assign(payload, {
          iso: parseInt(fixedIso),
          power_ratios: POWER_RATIOS
        })
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Calculation failed')
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error calculating flash distances:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFStopSequence = (step: number): number[] => {
    if (step === 1) {
      return [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64]
    } else if (step === 0.5) {
      return [1, 1.2, 1.4, 1.7, 2, 2.4, 2.8, 3.3, 4, 4.8, 5.6, 6.7, 8, 9.5, 11, 13, 16, 19, 22, 27, 32, 38, 45, 54, 64]
    } else {
      return [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32]
    }
  }

  const adjustFStop = (type: 'min' | 'max', direction: 'up' | 'down') => {
    const sequence = getFStopSequence(parseFloat(stepSize))
    const currentValue = parseFloat(type === 'min' ? minFStop : maxFStop)
    
    // Find closest value in sequence
    let closestIndex = 0
    let minDiff = Math.abs(sequence[0] - currentValue)
    
    for (let i = 1; i < sequence.length; i++) {
      const diff = Math.abs(sequence[i] - currentValue)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }
    
    // Adjust based on direction
    let newIndex = closestIndex
    if (direction === 'up' && closestIndex < sequence.length - 1) {
      newIndex = closestIndex + 1
    } else if (direction === 'down' && closestIndex > 0) {
      newIndex = closestIndex - 1
    }
    
    const newValue = sequence[newIndex].toString()
    
    if (type === 'min') {
      setMinFStop(newValue)
    } else {
      setMaxFStop(newValue)
    }
  }

  const addIsoPreset = (iso: number) => {
    const currentIsos = isoValues.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
    if (!currentIsos.includes(iso)) {
      const newIsos = [...currentIsos, iso].sort((a, b) => a - b)
      setIsoValues(newIsos.join(', '))
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Flash Guide</h1>
            <Zap className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-lg no-print">
            Flash exposure calculator for film photographers
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Form */}
          <Card className="bg-gray-900 border-gray-800 no-print">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calculator className="h-5 w-5" />
                Flash Calculator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Calculate flash distances using guide number and camera settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guide Number */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guide-number" className="text-gray-200">
                    Guide Number (GN) at ISO 100
                  </Label>
                  <Input
                    id="guide-number"
                    type="number"
                    value={guideNumber}
                    onChange={(e) => setGuideNumber(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="32"
                  />
                </div>

                {/* Units */}
                <div className="space-y-2">
                  <Label className="text-gray-200">Units</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={units === 'meters' ? 'default' : 'outline'}
                      onClick={() => setUnits('meters')}
                      className="flex-1"
                    >
                      Meters
                    </Button>
                    <Button
                      variant={units === 'feet' ? 'default' : 'outline'}
                      onClick={() => setUnits('feet')}
                      className="flex-1"
                    >
                      Feet
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table Type */}
              <div className="space-y-2">
                <Label className="text-gray-200">Table Type</Label>
                <div className="flex gap-4">
                  <Button
                    variant={tableType === 'iso' ? 'default' : 'outline'}
                    onClick={() => setTableType('iso')}
                    className="flex-1"
                  >
                    Distance vs ISO
                  </Button>
                  <Button
                    variant={tableType === 'power' ? 'default' : 'outline'}
                    onClick={() => setTableType('power')}
                    className="flex-1"
                  >
                    Distance vs Power
                  </Button>
                </div>
              </div>

              {/* ISO Values or Fixed ISO */}
              {tableType === 'iso' ? (
                <div className="space-y-2">
                  <Label htmlFor="iso-values" className="text-gray-200">
                    ISO Values (comma-separated)
                  </Label>
                  <Input
                    id="iso-values"
                    value={isoValues}
                    onChange={(e) => {
                      const value = e.target.value
                      setIsoValues(value)
                      
                      // Auto-sort if the input contains valid ISO values
                      if (value.includes(',')) {
                        const isos = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
                        if (isos.length > 1) {
                          const sortedIsos = [...new Set(isos)].sort((a, b) => a - b)
                          setIsoValues(sortedIsos.join(', '))
                        }
                      }
                    }}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="100, 200, 400, 800"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ISO_PRESETS.map(iso => (
                      <Badge
                        key={iso}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-600"
                        onClick={() => addIsoPreset(iso)}
                      >
                        ISO {iso}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="fixed-iso" className="text-gray-200">
                    Fixed ISO
                  </Label>
                  <Select value={fixedIso} onValueChange={setFixedIso}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {ISO_PRESETS.map(iso => (
                        <SelectItem key={iso} value={iso.toString()}>
                          ISO {iso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator className="bg-gray-700" />

              {/* F-Stop Range */}
              <div className="space-y-4">
                <Label className="text-gray-200">F-Stop Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="min-fstop" className="text-sm text-gray-400">
                      Min f-stop
                    </Label>
                    <div className="flex">
                      <Input
                        id="min-fstop"
                        type="number"
                        step="0.1"
                        value={minFStop}
                        onChange={(e) => setMinFStop(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white rounded-r-none"
                      />
                      <div className="flex flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-2 rounded-none rounded-tr border-gray-700 border-l-0"
                          onClick={() => adjustFStop('min', 'up')}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-2 rounded-none rounded-br border-gray-700 border-l-0 border-t-0"
                          onClick={() => adjustFStop('min', 'down')}
                        >
                          ▼
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="max-fstop" className="text-sm text-gray-400">
                      Max f-stop
                    </Label>
                    <div className="flex">
                      <Input
                        id="max-fstop"
                        type="number"
                        step="0.1"
                        value={maxFStop}
                        onChange={(e) => setMaxFStop(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white rounded-r-none"
                      />
                      <div className="flex flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-2 rounded-none rounded-tr border-gray-700 border-l-0"
                          onClick={() => adjustFStop('max', 'up')}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-2 rounded-none rounded-br border-gray-700 border-l-0 border-t-0"
                          onClick={() => adjustFStop('max', 'down')}
                        >
                          ▼
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="step-size" className="text-sm text-gray-400">
                      Step
                    </Label>
                    <Select value={stepSize} onValueChange={setStepSize}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="1">Full (1)</SelectItem>
                        <SelectItem value="0.5">Half (1/2)</SelectItem>
                        <SelectItem value="0.33">Third (1/3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Show Chart Toggle and Calculate Button */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-chart"
                    checked={showChart}
                    onCheckedChange={setShowChart}
                  />
                  <Label htmlFor="show-chart" className="text-gray-200">
                    Show Chart
                  </Label>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {loading ? 'Calculating...' : 'Calculate Flash Distances'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <FlashTable result={result} />
              {showChart && <FlashChart result={result} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
