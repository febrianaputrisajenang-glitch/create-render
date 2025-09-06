import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Camera, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Eye,
  RotateCcw,
  Clock
} from "lucide-react"
import * as THREE from 'three'

export interface CameraKeyframe {
  id: string
  position: [number, number, number]
  target: [number, number, number]
  duration: number // seconds to reach this keyframe
  name: string
}

interface CameraControlsProps {
  onAddKeyframe: (keyframe: Omit<CameraKeyframe, 'id'>) => void
  onDeleteKeyframe: (id: string) => void
  onPlayAnimation: () => void
  onStopAnimation: () => void
  onJumpToKeyframe: (keyframe: CameraKeyframe) => void
  keyframes: CameraKeyframe[]
  isPlaying: boolean
  currentCameraPosition: [number, number, number]
  currentCameraTarget: [number, number, number]
  onCameraChange: (position: [number, number, number], target: [number, number, number]) => void
}

export default function CameraControls({
  onAddKeyframe,
  onDeleteKeyframe,
  onPlayAnimation,
  onStopAnimation,
  onJumpToKeyframe,
  keyframes,
  isPlaying,
  currentCameraPosition,
  currentCameraTarget,
  onCameraChange
}: CameraControlsProps) {
  const [newKeyframeName, setNewKeyframeName] = useState('')
  const [newKeyframeDuration, setNewKeyframeDuration] = useState([2])
  const [isRecording, setIsRecording] = useState(false)

  const handleAddKeyframe = () => {
    const name = newKeyframeName.trim() || `Keyframe ${keyframes.length + 1}`
    
    onAddKeyframe({
      position: currentCameraPosition,
      target: currentCameraTarget,
      duration: newKeyframeDuration[0],
      name
    })
    
    setNewKeyframeName('')
    setNewKeyframeDuration([2])
    setIsRecording(false)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      onStopAnimation()
    } else {
      onPlayAnimation()
    }
  }

  const totalDuration = keyframes.reduce((sum, kf) => sum + kf.duration, 0)

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Camera Animation
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={handlePlayPause}
            disabled={keyframes.length < 2}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Add Keyframe Section */}
      {isRecording && (
        <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border border-primary/20">
          <h4 className="text-sm font-medium">Record New Keyframe</h4>
          
          <div className="space-y-2">
            <Label htmlFor="keyframe-name" className="text-xs">Keyframe Name</Label>
            <Input
              id="keyframe-name"
              placeholder={`Keyframe ${keyframes.length + 1}`}
              value={newKeyframeName}
              onChange={(e) => setNewKeyframeName(e.target.value)}
              className="text-xs"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Duration (seconds)</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={newKeyframeDuration}
                onValueChange={setNewKeyframeDuration}
                min={0.5}
                max={10}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs min-w-[3rem] text-muted-foreground">
                {newKeyframeDuration[0]}s
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs space-y-1">
              <Label>Position</Label>
              <div className="text-muted-foreground">
                X: {currentCameraPosition[0].toFixed(1)}<br/>
                Y: {currentCameraPosition[1].toFixed(1)}<br/>
                Z: {currentCameraPosition[2].toFixed(1)}
              </div>
            </div>
            <div className="text-xs space-y-1">
              <Label>Target</Label>
              <div className="text-muted-foreground">
                X: {currentCameraTarget[0].toFixed(1)}<br/>
                Y: {currentCameraTarget[1].toFixed(1)}<br/>
                Z: {currentCameraTarget[2].toFixed(1)}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleAddKeyframe}
            size="sm" 
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Keyframe
          </Button>
        </div>
      )}

      {/* Keyframes List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Keyframes ({keyframes.length})</Label>
          {totalDuration > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {totalDuration.toFixed(1)}s total
            </div>
          )}
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {keyframes.map((keyframe, index) => (
            <div
              key={keyframe.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs hover:bg-muted/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{keyframe.name}</div>
                <div className="text-muted-foreground">
                  {keyframe.duration}s • Frame {index + 1}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onJumpToKeyframe(keyframe)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDeleteKeyframe(keyframe.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {keyframes.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-4">
              No keyframes yet. Position camera and click Record to add keyframes.
            </div>
          )}
        </div>
      </div>

      {keyframes.length >= 2 && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          💡 Click Play to animate between keyframes
        </div>
      )}
    </Card>
  )
}