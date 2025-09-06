import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain,
  Sunset,
  Eye
} from "lucide-react"

export interface SkySettings {
  preset: 'day' | 'night' | 'sunset' | 'cloudy' | 'rainy' | 'orange'
  intensity: number
  fogDensity: number
  cloudCoverage: number
  cloudDensity: number
}

interface SkyControlsProps {
  skySettings: SkySettings
  onSkyChange: (settings: SkySettings) => void
}

const skyPresets = [
  {
    name: 'Day',
    preset: 'day' as const,
    icon: Sun,
    description: 'Bright daylight',
    color: '#87CEEB'
  },
  {
    name: 'Night',
    preset: 'night' as const,
    icon: Moon,
    description: 'Dark night sky',
    color: '#191970'
  },
  {
    name: 'Sunset', 
    preset: 'sunset' as const,
    icon: Sunset,
    description: 'Golden hour',
    color: '#FF6347'
  },
  {
    name: 'Cloudy',
    preset: 'cloudy' as const,
    icon: Cloud,
    description: 'Overcast sky',
    color: '#708090'
  },
  {
    name: 'Rainy',
    preset: 'rainy' as const,
    icon: CloudRain,
    description: 'Storm clouds',
    color: '#2F4F4F'
  },
  {
    name: 'Orange',
    preset: 'orange' as const,
    icon: Eye,
    description: 'Vibrant orange',
    color: '#FF4500'
  }
]

export default function SkyControls({
  skySettings,
  onSkyChange
}: SkyControlsProps) {
  const handlePresetChange = (preset: SkySettings['preset']) => {
    onSkyChange({
      ...skySettings,
      preset
    })
  }

  const handleIntensityChange = (value: number[]) => {
    onSkyChange({
      ...skySettings,
      intensity: value[0]
    })
  }

  const handleFogDensityChange = (value: number[]) => {
    onSkyChange({
      ...skySettings,
      fogDensity: value[0]
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Sky & Weather
        </h3>
      </div>

      {/* Sky Presets */}
      <div className="space-y-3">
        <Label className="text-xs">Weather Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {skyPresets.map((preset) => {
            const IconComponent = preset.icon
            return (
              <Button
                key={preset.preset}
                variant={skySettings.preset === preset.preset ? "default" : "outline"}
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => handlePresetChange(preset.preset)}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs font-medium">{preset.name}</span>
                </div>
                <div 
                  className="w-full h-2 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
              </Button>
            )
          })}
        </div>
      </div>

      {/* Intensity Control */}
      <div className="space-y-2">
        <Label className="text-xs">Light Intensity</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[skySettings.intensity]}
            onValueChange={handleIntensityChange}
            min={0.1}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs min-w-[3rem] text-muted-foreground">
            {skySettings.intensity.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Fog Density */}
      <div className="space-y-2">
        <Label className="text-xs">Atmospheric Fog</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[skySettings.fogDensity]}
            onValueChange={handleFogDensityChange}
            min={0}
            max={0.1}
            step={0.001}
            className="flex-1"
          />
          <span className="text-xs min-w-[3rem] text-muted-foreground">
            {(skySettings.fogDensity * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Cloud Coverage */}
      <div className="space-y-2">
        <Label className="text-xs">Cloud Coverage</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[skySettings.cloudCoverage]}
            onValueChange={(value) => onSkyChange({ ...skySettings, cloudCoverage: value[0] })}
            min={0}
            max={1}
            step={0.05}
            className="flex-1"
          />
          <span className="text-xs min-w-[3rem] text-muted-foreground">
            {(skySettings.cloudCoverage * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Cloud Density */}
      <div className="space-y-2">
        <Label className="text-xs">Cloud Density</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[skySettings.cloudDensity]}
            onValueChange={(value) => onSkyChange({ ...skySettings, cloudDensity: value[0] })}
            min={0.1}
            max={2}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs min-w-[3rem] text-muted-foreground">
            {skySettings.cloudDensity.toFixed(1)}x
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        🌤️ Dynamic weather affects lighting and mood
      </div>
    </Card>
  )
}