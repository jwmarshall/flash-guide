import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Printer } from 'lucide-react'

interface CalculationResult {
  data: number[][]
  rowHeaders: string[]
  columnHeaders: string[]
  units: string
  mode: string
}

interface FlashTableProps {
  result: CalculationResult
}

export function FlashTable({ result }: FlashTableProps) {
  const handleCopy = () => {
    let tableText = `Flash Distance Table (${result.units})\n\n`
    tableText += `\t${result.columnHeaders.map(h => `f/${h}`).join('\t')}\n`
    
    result.rowHeaders.forEach((rowHeader, i) => {
      tableText += `${rowHeader}\t${result.data[i].map(d => d.toFixed(1)).join('\t')}\n`
    })
    
    navigator.clipboard.writeText(tableText)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Flash Distance Table ({result.units})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 text-gray-300 font-medium">
                  {result.mode === 'iso' ? 'ISO' : 'Power'}
                </th>
                {result.columnHeaders.map((fstop) => (
                  <th key={fstop} className="text-center p-3 text-gray-300 font-medium">
                    f/{fstop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rowHeaders.map((rowHeader, rowIndex) => (
                <tr key={rowHeader} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-3 font-medium text-blue-400">
                    {result.mode === 'iso' ? `ISO ${rowHeader}` : `1/${rowHeader}`}
                  </td>
                  {result.data[rowIndex].map((distance, colIndex) => (
                    <td key={colIndex} className="text-center p-3 text-white font-mono">
                      {distance.toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Distances shown in {result.units}. Values calculated using guide number formula.
        </p>
      </CardContent>
    </Card>
  )
}
