"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Clock, History, AlertCircle } from "lucide-react"
import { FeedButton } from "./feed-button"
import { ScheduleForm } from "./schedule-form"
import { FeedingHistory } from "./feeding-history"

export function PetFeederDashboard() {
  const [schedules, setSchedules] = useState([
    { id: 1, time: "08:00", name: "Morning Feed", active: true },
    { id: 2, time: "18:00", name: "Evening Feed", active: true },
  ])
  const [feedingHistory, setFeedingHistory] = useState([
    { id: 1, time: "2024-11-11 07:45", type: "Manual", status: "success" },
    { id: 2, time: "2024-11-10 18:02", type: "Scheduled", status: "success" },
  ])
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  const handleFeed = () => {
    const now = new Date()
    setFeedingHistory([
      {
        id: feedingHistory.length + 1,
        time: now.toLocaleString(),
        type: "Manual",
        status: "success",
      },
      ...feedingHistory,
    ])
  }

  const handleAddSchedule = (schedule: any) => {
    setSchedules([...schedules, { ...schedule, id: schedules.length + 1 }])
    setShowScheduleForm(false)
  }

  const handleRemoveSchedule = (id: number) => {
    setSchedules(schedules.filter((s) => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance mb-2">🐾 Pet Feeder</h1>
        <p className="text-muted-foreground">Control your smart pet feeder in real-time</p>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <Card className="mb-6 border-destructive bg-destructive/10 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Device Disconnected</p>
            <p className="text-sm text-destructive/80">Unable to connect to ESP32. Check your network connection.</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Button */}
        <div className="lg:col-span-1">
          <FeedButton onFeed={handleFeed} disabled={!isConnected} />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className="text-2xl font-bold text-primary">Connected</div>
            <div className="text-xs text-muted-foreground mt-2">ESP32 • Ready</div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/20">
            <div className="text-sm text-muted-foreground mb-1">Food Level</div>
            <div className="text-2xl font-bold text-secondary">75%</div>
            <div className="text-xs text-muted-foreground mt-2">Estimated 3 days left</div>
          </Card>
        </div>
      </div>

      {/* Schedules Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-balance">Scheduled Feedings</h2>
          </div>
          <Button
            onClick={() => setShowScheduleForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </Button>
        </div>

        {showScheduleForm && <ScheduleForm onAdd={handleAddSchedule} onCancel={() => setShowScheduleForm(false)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-2 border-secondary/20 hover:border-secondary/40 transition-colors"
            >
              <div>
                <div className="font-semibold text-foreground">{schedule.time}</div>
                <div className="text-sm text-muted-foreground">{schedule.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${schedule.active ? "bg-primary" : "bg-muted-foreground"}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSchedule(schedule.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Feeding History */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-balance">Feeding History</h2>
        </div>
        <FeedingHistory history={feedingHistory} />
      </div>
    </div>
  )
}
