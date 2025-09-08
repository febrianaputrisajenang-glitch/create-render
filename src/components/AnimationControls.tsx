import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Play, 
  Pause, 
  Square, 
  Plus,
  Trash2,
  RotateCcw,
  Move,
  Maximize2
} from "lucide-react"

export interface AnimationKeyframe {
  id: string
  time: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface ObjectAnimation {
  id: string
  objectId: string
  name: string
  duration: number
  loop: boolean
  keyframes: AnimationKeyframe[]
}

interface AnimationControlsProps {
  selectedObjectId: string | null
  animations: ObjectAnimation[]
  onAddAnimation: (animation: Omit<ObjectAnimation, 'id'>) => void
  onDeleteAnimation: (id: string) => void
  onUpdateAnimation: (id: string, updates: Partial<ObjectAnimation>) => void
  onPlayAnimation: (id: string) => void
  onStopAnimation: (id: string) => void
  isPlaying: Record<string, boolean>
  onAddKeyframe: (animationId: string, keyframe: Omit<AnimationKeyframe, 'id'>) => void
  onDeleteKeyframe: (animationId: string, keyframeId: string) => void
  onUpdateKeyframe: (animationId: string, keyframeId: string, updates: Partial<AnimationKeyframe>) => void
  currentObjectTransform?: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  }
}

export function AnimationControls({
  selectedObjectId,
  animations,
  onAddAnimation,
  onDeleteAnimation,
  onUpdateAnimation,
  onPlayAnimation,
  onStopAnimation,
  isPlaying,
  onAddKeyframe,
  onDeleteKeyframe,
  onUpdateKeyframe,
  currentObjectTransform
}: AnimationControlsProps) {
  const [newAnimationName, setNewAnimationName] = useState('')
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null)
  const [keyframeTime, setKeyframeTime] = useState(0)
  
  const selectedObjectAnimations = animations.filter(anim => anim.objectId === selectedObjectId)
  const selectedAnimation = animations.find(anim => anim.id === selectedAnimationId)

  const handleCreateAnimation = useCallback(() => {
    if (!selectedObjectId || !newAnimationName.trim()) return
    
    const newAnimation: Omit<ObjectAnimation, 'id'> = {
      objectId: selectedObjectId,
      name: newAnimationName.trim(),
      duration: 2,
      loop: false,
      keyframes: []
    }
    
    onAddAnimation(newAnimation)
    setNewAnimationName('')
  }, [selectedObjectId, newAnimationName, onAddAnimation])

  const handleAddKeyframeFromCurrent = useCallback(() => {
    if (!selectedAnimation || !currentObjectTransform) return
    
    const newKeyframe: Omit<AnimationKeyframe, 'id'> = {
      time: keyframeTime,
      position: currentObjectTransform.position,
      rotation: currentObjectTransform.rotation,
      scale: currentObjectTransform.scale,
      easing: 'ease-in-out'
    }
    
    onAddKeyframe(selectedAnimation.id, newKeyframe)
  }, [selectedAnimation, currentObjectTransform, keyframeTime, onAddKeyframe])

  if (!selectedObjectId) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Select an object to create animations</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Create New Animation */}
      <Card className="p-4 space-y-3">
        <h4 className="text-sm font-medium">Create Animation</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Animation name"
            value={newAnimationName}
            onChange={(e) => setNewAnimationName(e.target.value)}
            className="text-sm"
          />
          <Button 
            size="sm" 
            onClick={handleCreateAnimation}
            disabled={!newAnimationName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Animation List */}
      {selectedObjectAnimations.length > 0 && (
        <Card className="p-4 space-y-3">
          <h4 className="text-sm font-medium">Object Animations</h4>
          <div className="space-y-2">
            {selectedObjectAnimations.map((animation) => (
              <div key={animation.id} className="flex items-center gap-2 p-2 border rounded">
                <div className="flex-1">
                  <p className="text-sm font-medium">{animation.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {animation.duration}s • {animation.keyframes.length} keyframes
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedAnimationId(animation.id)}
                    className="h-6 w-6 p-0"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => 
                      isPlaying[animation.id] 
                        ? onStopAnimation(animation.id)
                        : onPlayAnimation(animation.id)
                    }
                    className="h-6 w-6 p-0"
                  >
                    {isPlaying[animation.id] ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteAnimation(animation.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Animation Editor */}
      {selectedAnimation && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Edit: {selectedAnimation.name}</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedAnimationId(null)}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>

          {/* Animation Properties */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Duration (seconds)</label>
              <Slider
                value={[selectedAnimation.duration]}
                onValueChange={([value]) => 
                  onUpdateAnimation(selectedAnimation.id, { duration: value })
                }
                min={0.1}
                max={10}
                step={0.1}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedAnimation.loop}
                onChange={(e) => 
                  onUpdateAnimation(selectedAnimation.id, { loop: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label className="text-xs font-medium">Loop animation</label>
            </div>
          </div>

          <Separator />

          {/* Keyframe Management */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground uppercase">Keyframes</h5>
            
            {/* Add Keyframe */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Time</label>
                <Slider
                  value={[keyframeTime]}
                  onValueChange={([value]) => setKeyframeTime(value)}
                  min={0}
                  max={selectedAnimation.duration}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <Button
                size="sm"
                onClick={handleAddKeyframeFromCurrent}
                disabled={!currentObjectTransform}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Keyframe List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedAnimation.keyframes
                .sort((a, b) => a.time - b.time)
                .map((keyframe) => (
                  <div key={keyframe.id} className="flex items-center gap-2 p-2 bg-secondary/20 rounded text-xs">
                    <div className="flex-1">
                      <div className="font-medium">T: {keyframe.time.toFixed(1)}s</div>
                      <div className="text-muted-foreground">
                        P: ({keyframe.position.map(v => v.toFixed(1)).join(', ')})
                      </div>
                    </div>
                    
                    <Select
                      value={keyframe.easing}
                      onValueChange={(value: any) => 
                        onUpdateKeyframe(selectedAnimation.id, keyframe.id, { easing: value })
                      }
                    >
                      <SelectTrigger className="w-20 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteKeyframe(selectedAnimation.id, keyframe.id)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}