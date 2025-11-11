"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface FeedingEvent {
  id: number
  time: string
  type: "Manual" | "Scheduled"
  status: "success" | "failed"
}

interface FeedingHistoryProps {
  history: FeedingEvent[]
}

export function FeedingHistory({ history }: FeedingHistoryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {history.length === 0 ? (
        <Card className="p-6 col-span-full text-center text-muted-foreground bg-card/50 backdrop-blur-sm border-2 border-border/50">
          No feeding history yet. Start by feeding your pet!
        </Card>
      ) : (
        history.map((event) => (
          <Card
            key={event.id}
            className="p-4 flex items-start gap-3 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-secondary/40 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-balance">
                {event.type === "Manual" ? "🎯 Manual Feed" : "⏰ Scheduled Feed"}
              </div>
              <div className="text-sm text-muted-foreground">{event.time}</div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
