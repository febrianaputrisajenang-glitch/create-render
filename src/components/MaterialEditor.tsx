import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Palette, 
  Upload, 
  Image, 
  Trash2,
  Sparkles,
  Sun,
  Circle
} from "lucide-react"

export interface MaterialProperties {
  color: string
  metalness: number
  roughness: number
  textureUrl?: string
  emissive: string
  emissiveIntensity: number
}

interface MaterialEditorProps {
  selectedObjectId: string | null
  materialProperties: MaterialProperties
  onMaterialChange: (properties: MaterialProperties) => void
}

export default function MaterialEditor({
  selectedObjectId,
  materialProperties,
  onMaterialChange
}: MaterialEditorProps) {
  const [texturePreview, setTexturePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const presetColors = [
    '#00ffff', '#ff0080', '#00ff88', '#ffaa00',
    '#8a2be2', '#ff4444', '#44ff44', '#4444ff',
    '#ffffff', '#cccccc', '#888888', '#333333'
  ]

  const presetMaterials = [
    { name: 'Plastic', metalness: 0, roughness: 0.8, emissive: '#000000', emissiveIntensity: 0 },
    { name: 'Metal', metalness: 1, roughness: 0.2, emissive: '#000000', emissiveIntensity: 0 },
    { name: 'Glass', metalness: 0, roughness: 0.1, emissive: '#000000', emissiveIntensity: 0 },
    { name: 'Rubber', metalness: 0, roughness: 0.9, emissive: '#000000', emissiveIntensity: 0 },
    { name: 'Neon', metalness: 0, roughness: 0.3, emissive: materialProperties.color, emissiveIntensity: 0.5 }
  ]

  const handleColorChange = (color: string) => {
    onMaterialChange({
      ...materialProperties,
      color
    })
  }

  const handleMetalnessChange = (value: number[]) => {
    onMaterialChange({
      ...materialProperties,
      metalness: value[0]
    })
  }

  const handleRoughnessChange = (value: number[]) => {
    onMaterialChange({
      ...materialProperties,
      roughness: value[0]
    })
  }

  const handleEmissiveChange = (color: string) => {
    onMaterialChange({
      ...materialProperties,
      emissive: color
    })
  }

  const handleEmissiveIntensityChange = (value: number[]) => {
    onMaterialChange({
      ...materialProperties,
      emissiveIntensity: value[0]
    })
  }

  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setTexturePreview(result)
        onMaterialChange({
          ...materialProperties,
          textureUrl: result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveTexture = () => {
    setTexturePreview(null)
    onMaterialChange({
      ...materialProperties,
      textureUrl: undefined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const applyPresetMaterial = (preset: typeof presetMaterials[0]) => {
    onMaterialChange({
      ...materialProperties,
      metalness: preset.metalness,
      roughness: preset.roughness,
      emissive: preset.emissive,
      emissiveIntensity: preset.emissiveIntensity
    })
  }

  if (!selectedObjectId) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-muted-foreground">
          <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Select an object to edit materials
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Material Editor
      </h3>

      {/* Color Picker */}
      <div className="space-y-3">
        <Label className="text-xs">Base Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={materialProperties.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer"
          />
          <Input
            value={materialProperties.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="text-xs font-mono"
            placeholder="#00ffff"
          />
        </div>
        
        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-105 ${
                materialProperties.color === color ? 'border-primary' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Material Properties */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Metalness</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[materialProperties.metalness]}
              onValueChange={handleMetalnessChange}
              min={0}
              max={1}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs min-w-[2rem] text-muted-foreground">
              {materialProperties.metalness.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Roughness</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[materialProperties.roughness]}
              onValueChange={handleRoughnessChange}
              min={0}
              max={1}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs min-w-[2rem] text-muted-foreground">
              {materialProperties.roughness.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Emissive Properties */}
      <div className="space-y-3">
        <Label className="text-xs flex items-center gap-2">
          <Sparkles className="h-3 w-3" />
          Emissive (Glow)
        </Label>
        
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={materialProperties.emissive}
            onChange={(e) => handleEmissiveChange(e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer"
          />
          <Input
            value={materialProperties.emissive}
            onChange={(e) => handleEmissiveChange(e.target.value)}
            className="text-xs font-mono"
            placeholder="#000000"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Glow Intensity</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[materialProperties.emissiveIntensity]}
              onValueChange={handleEmissiveIntensityChange}
              min={0}
              max={2}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs min-w-[2rem] text-muted-foreground">
              {materialProperties.emissiveIntensity.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Material Presets */}
      <div className="space-y-2">
        <Label className="text-xs">Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetMaterials.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => applyPresetMaterial(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Texture Upload */}
      <div className="space-y-3">
        <Label className="text-xs flex items-center gap-2">
          <Image className="h-3 w-3" />
          Texture
        </Label>
        
        {texturePreview || materialProperties.textureUrl ? (
          <div className="space-y-2">
            <div className="relative">
              <img
                src={texturePreview || materialProperties.textureUrl}
                alt="Texture preview"
                className="w-full h-16 object-cover rounded border border-border"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={handleRemoveTexture}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Texture
          </Button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleTextureUpload}
          className="hidden"
        />
      </div>

      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        💡 Adjust metalness and roughness for realistic materials
      </div>
    </Card>
  )
}