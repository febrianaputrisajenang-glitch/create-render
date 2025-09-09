import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { 
  Play, 
  Pause, 
  Square, 
  Plus,
  Trash2,
  RotateCcw,
  Move,
  Maximize2,
  Smile,
  Frown,
  Meh,
  Angry,
  Eye
} from "lucide-react"

export interface CharacterKeyframe {
  id: string
  time: number
  // Transform properties
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  // Joint rotations
  headRotation: [number, number, number]
  leftArmRotation: [number, number, number]
  rightArmRotation: [number, number, number]
  leftLegRotation: [number, number, number]
  rightLegRotation: [number, number, number]
  // Facial expressions
  faceExpression: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'wise' | 'casting' | 'determined'
  eyeDirection: [number, number]
  // Special properties
  magicIntensity?: number
  powerLevel?: number
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface CharacterAnimation {
  id: string
  objectId: string
  name: string
  duration: number
  loop: boolean
  keyframes: CharacterKeyframe[]
}

interface CharacterAnimationControlsProps {
  selectedObjectId: string | null
  selectedObjectType: string | null
  animations: CharacterAnimation[]
  onAddAnimation: (animation: Omit<CharacterAnimation, 'id'>) => void
  onDeleteAnimation: (id: string) => void
  onUpdateAnimation: (id: string, updates: Partial<CharacterAnimation>) => void
  onPlayAnimation: (id: string) => void
  onStopAnimation: (id: string) => void
  isPlaying: Record<string, boolean>
  onAddKeyframe: (animationId: string, keyframe: Omit<CharacterKeyframe, 'id'>) => void
  onDeleteKeyframe: (animationId: string, keyframeId: string) => void
  onUpdateKeyframe: (animationId: string, keyframeId: string, updates: Partial<CharacterKeyframe>) => void
  currentCharacterTransform?: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  }
  onCharacterTransform?: (objectId: string, transform: {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
  }) => void
}

export function CharacterAnimationControls({
  selectedObjectId,
  selectedObjectType,
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
  currentCharacterTransform,
  onCharacterTransform
}: CharacterAnimationControlsProps) {
  const [newAnimationName, setNewAnimationName] = useState('')
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null)
  const [keyframeTime, setKeyframeTime] = useState(0)
  
  // Character transform controls
  const [localPosition, setLocalPosition] = useState<[number, number, number]>([0, 0, 0])
  const [localRotation, setLocalRotation] = useState<[number, number, number]>([0, 0, 0])
  const [localScale, setLocalScale] = useState<[number, number, number]>([1, 1, 1])
  
  // Facial expression controls
  const [faceExpression, setFaceExpression] = useState<string>('neutral')
  const [eyeDirection, setEyeDirection] = useState<[number, number]>([0, 0])
  const [magicIntensity, setMagicIntensity] = useState(0.3)
  const [powerLevel, setPowerLevel] = useState(0.8)
  
  const selectedObjectAnimations = animations.filter(anim => anim.objectId === selectedObjectId)
  const selectedAnimation = animations.find(anim => anim.id === selectedAnimationId)
  
  const isCharacterType = selectedObjectType && ['player', 'knight', 'wizard', 'robot'].includes(selectedObjectType)

  const handleCreateAnimation = useCallback(() => {
    if (!selectedObjectId || !newAnimationName.trim()) return
    
    const newAnimation: Omit<CharacterAnimation, 'id'> = {
      objectId: selectedObjectId,
      name: newAnimationName.trim(),
      duration: 3,
      loop: false,
      keyframes: []
    }
    
    onAddAnimation(newAnimation)
    setNewAnimationName('')
  }, [selectedObjectId, newAnimationName, onAddAnimation])

  const handleAddKeyframeFromCurrent = useCallback(() => {
    if (!selectedAnimation || !currentCharacterTransform) return
    
    const newKeyframe: Omit<CharacterKeyframe, 'id'> = {
      time: keyframeTime,
      position: currentCharacterTransform.position,
      rotation: currentCharacterTransform.rotation,
      scale: currentCharacterTransform.scale,
      headRotation: [0, 0, 0],
      leftArmRotation: [0, 0, 0],
      rightArmRotation: [0, 0, 0],
      leftLegRotation: [0, 0, 0],
      rightLegRotation: [0, 0, 0],
      faceExpression: faceExpression as any,
      eyeDirection: eyeDirection,
      magicIntensity: magicIntensity,
      powerLevel: powerLevel,
      easing: 'ease-in-out'
    }
    
    onAddKeyframe(selectedAnimation.id, newKeyframe)
  }, [selectedAnimation, currentCharacterTransform, keyframeTime, faceExpression, eyeDirection, magicIntensity, powerLevel, onAddKeyframe])

  const handleTransformChange = useCallback((type: 'position' | 'rotation' | 'scale', axis: number, value: number) => {
    if (!selectedObjectId || !onCharacterTransform) return
    
    const newTransform = { [type]: type === 'position' ? localPosition : type === 'rotation' ? localRotation : localScale }
    newTransform[type][axis] = value
    
    if (type === 'position') setLocalPosition([...newTransform[type]] as [number, number, number])
    else if (type === 'rotation') setLocalRotation([...newTransform[type]] as [number, number, number])
    else setLocalScale([...newTransform[type]] as [number, number, number])
    
    onCharacterTransform(selectedObjectId, { [type]: newTransform[type] })
  }, [selectedObjectId, localPosition, localRotation, localScale, onCharacterTransform])

  if (!selectedObjectId || !isCharacterType) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Select a character to animate</p>
      </Card>
    )
  }

  const getExpressionOptions = () => {
    switch (selectedObjectType) {
      case 'player':
        return ['neutral', 'happy', 'sad', 'angry', 'surprised']
      case 'knight':
        return ['neutral', 'angry', 'determined']
      case 'wizard':
        return ['neutral', 'wise', 'casting']
      case 'robot':
        return ['neutral']
      default:
        return ['neutral']
    }
  }

  return (
    <div className="space-y-4">
      {/* Character Transform Controls */}
      <Card className="p-4 space-y-4">
        <h4 className="text-sm font-medium">Character Transform</h4>
        
        {/* Position */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Position</Label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis}>
                <Label className="text-xs">{axis}</Label>
                <Slider
                  value={[localPosition[index]]}
                  onValueChange={([value]) => handleTransformChange('position', index, value)}
                  min={-10}
                  max={10}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Rotation</Label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis}>
                <Label className="text-xs">{axis}</Label>
                <Slider
                  value={[localRotation[index]]}
                  onValueChange={([value]) => handleTransformChange('rotation', index, value)}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Scale</Label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis}>
                <Label className="text-xs">{axis}</Label>
                <Slider
                  value={[localScale[index]]}
                  onValueChange={([value]) => handleTransformChange('scale', index, value)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Facial Expression Controls */}
      <Card className="p-4 space-y-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Smile className="h-4 w-4" />
          Facial Expressions
        </h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Expression</Label>
            <Select value={faceExpression} onValueChange={setFaceExpression}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getExpressionOptions().map((expr) => (
                  <SelectItem key={expr} value={expr}>
                    {expr.charAt(0).toUpperCase() + expr.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Eye Direction
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Horizontal</Label>
                <Slider
                  value={[eyeDirection[0]]}
                  onValueChange={([value]) => setEyeDirection([value, eyeDirection[1]])}
                  min={-1}
                  max={1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Vertical</Label>
                <Slider
                  value={[eyeDirection[1]]}
                  onValueChange={([value]) => setEyeDirection([eyeDirection[0], value])}
                  min={-1}
                  max={1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Wizard-specific controls */}
          {selectedObjectType === 'wizard' && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Magic Intensity</Label>
              <Slider
                value={[magicIntensity]}
                onValueChange={([value]) => setMagicIntensity(value)}
                min={0}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
          )}

          {/* Robot-specific controls */}
          {selectedObjectType === 'robot' && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Power Level</Label>
              <Slider
                value={[powerLevel]}
                onValueChange={([value]) => setPowerLevel(value)}
                min={0}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Create New Animation */}
      <Card className="p-4 space-y-3">
        <h4 className="text-sm font-medium">Create Character Animation</h4>
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
          <h4 className="text-sm font-medium">Character Animations</h4>
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
              <Label className="text-xs font-medium text-muted-foreground">Duration (seconds)</Label>
              <Slider
                value={[selectedAnimation.duration]}
                onValueChange={([value]) => 
                  onUpdateAnimation(selectedAnimation.id, { duration: value })
                }
                min={0.5}
                max={20}
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
              <Label className="text-xs font-medium">Loop animation</Label>
            </div>
          </div>

          <Separator />

          {/* Keyframe Management */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground uppercase">Keyframes</h5>
            
            {/* Add Keyframe */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs font-medium text-muted-foreground">Time</Label>
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
                disabled={!currentCharacterTransform}
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
                        Expr: {keyframe.faceExpression} • Eyes: ({keyframe.eyeDirection.map(v => v.toFixed(1)).join(', ')})
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