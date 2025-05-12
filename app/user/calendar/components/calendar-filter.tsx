"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Wrench, AlertTriangle, Info, Filter, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type FilterType = "all" | "expiration" | "maintenance" | "reminder"

interface CalendarFilterProps {
  value: FilterType
  onChange: (value: FilterType) => void
  className?: string
}

export function CalendarFilter({ value, onChange, className }: CalendarFilterProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-amber-700" />
        <Label className="font-medium text-amber-900">Filter Events</Label>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <FilterButton 
          isActive={value === "all"}
          onClick={() => onChange("all")}
          icon={<Check className="h-4 w-4 mr-2" />}
          label="All Events"
        />
        
        <FilterButton 
          isActive={value === "expiration"}
          onClick={() => onChange("expiration")}
          icon={<Shield className="h-4 w-4 mr-2" />}
          label="Warranty Expiration"
          badgeColor="bg-amber-500"
        />
        
        <FilterButton 
          isActive={value === "maintenance"}
          onClick={() => onChange("maintenance")}
          icon={<Wrench className="h-4 w-4 mr-2" />}
          label="Maintenance"
          badgeColor="bg-blue-500"
        />
        
        <FilterButton 
          isActive={value === "reminder"}
          onClick={() => onChange("reminder")}
          icon={<AlertTriangle className="h-4 w-4 mr-2" />}
          label="Reminder"
          badgeColor="bg-red-500"
        />
      </div>
      
      {/* Alternative dropdown for smaller screens */}
      <div className="sm:hidden">
        <Select
          value={value}
          onValueChange={(val) => onChange(val as FilterType)}
        >
          <SelectTrigger className="w-full border-2 border-amber-800 bg-amber-50">
            <SelectValue placeholder="Filter by event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="expiration">Warranty Expiration</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

interface FilterButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badgeColor?: string
}

function FilterButton({ isActive, onClick, icon, label, badgeColor }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-amber-800 text-amber-50" 
          : "text-amber-900 hover:bg-amber-200"
      )}
    >
      {icon}
      <span>{label}</span>
      {badgeColor && (
        <Badge className={cn("ml-auto", badgeColor, "text-white")}>
          <span className="sr-only">{label}</span>
        </Badge>
      )}
    </button>
  )
} 