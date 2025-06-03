"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Database, Play, AlertCircle, Check } from "lucide-react"

export default function QueryPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const executeQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setResults(null)

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "An error occurred while executing the query")
        return
      }

      if (Array.isArray(data.results)) {
        setResults(data.results)
      } else if (data.affectedRows !== undefined) {
        setSuccess(`Query executed successfully. ${data.affectedRows} row(s) affected.`)
      } else {
        setSuccess("Query executed successfully.")
      }
    } catch (error) {
      setError("An error occurred while executing the query")
      console.error("Query execution error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">SQL Query Executor</h1>
          <p className="text-xl text-gray-300">Execute custom SQL queries against the PawPal database</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-purple-400" />
                Enter SQL Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  className="min-h-[200px] bg-gray-700 border-gray-600 text-white font-mono"
                  placeholder="SELECT * FROM Pets;"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  onClick={executeQuery}
                  className="gradient-lilac hover:opacity-90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Query
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="bg-red-900/30 border-red-700 mb-6 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">Error</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="bg-green-900/30 border-green-700 mb-6 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-300 mb-1">Success</h3>
                    <p className="text-green-200">{success}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results && results.length > 0 && (
            <Card className="bg-gray-800 border-gray-700 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-white">Query Results</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="px-4 py-2 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-t border-gray-700">
                        {Object.values(row).map((value: any, j) => (
                          <td key={j} className="px-4 py-2">
                            {value === null ? (
                              <span className="text-gray-500">NULL</span>
                            ) : typeof value === "object" ? (
                              JSON.stringify(value)
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {results && results.length === 0 && (
            <Card className="bg-gray-800 border-gray-700 animate-fade-in">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">Query executed successfully, but no results were returned.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
