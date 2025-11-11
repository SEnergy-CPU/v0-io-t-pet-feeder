"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ScheduleFormProps {
  onAdd: (schedule: { time: string; name: string; active: boolean }) => void
  onCancel: () => void
}

export function ScheduleForm({ onAdd, onCancel }: ScheduleFormProps) {
  const [time, setTime] = useState("09:00")
  const [name, setName] = useState("Feed")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ time, name, active: true })
    setTime("09:00")
    setName("Feed")
  }

  return (
    <Card className="p-6 mb-4 bg-card/50 backdrop-blur-sm border-2 border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Feeding Time</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Schedule Name</label>
          <Input
            type="text"
            placeholder="e.g., Morning Feed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            Add Schedule
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
