import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

interface CalculationResult {
  data: number[][]
  rowHeaders: string[]
  columnHeaders: string[]
  units: string
  mode: string
}

interface FlashChartProps {
  result: CalculationResult
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

export function FlashChart({ result }: FlashChartProps) {
  // Transform data for recharts
  const chartData = result.columnHeaders.map((fstop, colIndex) => {
    const dataPoint: any = { fstop: `f/${fstop}` }
    result.rowHeaders.forEach((rowHeader, rowIndex) => {
      const key = result.mode === 'iso' ? `ISO ${rowHeader}` : `1/${rowHeader}`
      dataPoint[key] = result.data[rowIndex][colIndex]
    })
    return dataPoint
  })

  const chartConfig = result.rowHeaders.reduce((config, rowHeader, index) => {
    const key = result.mode === 'iso' ? `ISO ${rowHeader}` : `1/${rowHeader}`
    config[key] = {
      label: key,
      color: COLORS[index % COLORS.length]
    }
    return config
  }, {} as any)

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          Flash Distance Chart ({result.units})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="fstop"
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                label={{
                  value: `Distance (${result.units})`,
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#9ca3af' }
                }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
              />
              <Legend
                wrapperStyle={{ color: '#9ca3af' }}
              />
              {result.rowHeaders.map((rowHeader, index) => {
                const key = result.mode === 'iso' ? `ISO ${rowHeader}` : `1/${rowHeader}`
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: COLORS[index % COLORS.length], strokeWidth: 2 }}
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="text-sm text-gray-400 mt-4">
          Each line represents a different {result.mode === 'iso' ? 'ISO value' : 'power ratio'}.
          Lower f-stops require closer flash distances.
        </p>
      </CardContent>
    </Card>
  )
}
