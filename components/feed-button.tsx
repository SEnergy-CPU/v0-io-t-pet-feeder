"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"

interface FeedButtonProps {
  onFeed: () => void
  disabled?: boolean
}

export function FeedButton({ onFeed, disabled = false }: FeedButtonProps) {
  const [isFeeding, setIsFeeding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedCount, setFeedCount] = useState(0)

  const handleFeed = async () => {
    setIsFeeding(true)
    setError(null)

    try {
      console.log("[v0] Sending feed command to API...")

      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("[v0] API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to send feed command")
      }

      // Successful feed
      setFeedCount((prev) => prev + 1)
      onFeed()
      setError(null)
    } catch (error) {
      console.error("[v0] Feed error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to connect to Pet Feeder. Make sure it's powered on and the IP is set correctly.",
      )
    }

    setTimeout(() => {
      setIsFeeding(false)
    }, 2000)
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-center">
        <div className="mb-6">
          <Activity className="w-12 h-12 mx-auto opacity-80" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Dispense Food</h3>
        <p className="text-sm opacity-90 mb-6">
          {isFeeding ? "Servo rotating..." : `Ready to feed your pet (${feedCount} times today)`}
        </p>
        {error && <p className="text-sm text-red-200 mb-4 font-semibold">{error}</p>}

        <Button
          onClick={handleFeed}
          disabled={disabled || isFeeding}
          className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
            isFeeding
              ? "bg-primary-foreground/30 text-primary-foreground cursor-wait"
              : "bg-white/20 hover:bg-white/30 text-primary-foreground"
          }`}
        >
          {isFeeding ? "Feeding..." : "Feed Pet"}
        </Button>
      </div>
    </Card>
  )
}
