import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MaterialProperties } from './MaterialEditor'

interface ShaderPreset {
  name: string
  description: string
  material: MaterialProperties
  category: 'metal' | 'organic' | 'glass' | 'fabric' | 'stone' | 'special'
}

const shaderPresets: ShaderPreset[] = [
  // Metal Materials
  {
    name: 'Chrome',
    description: 'Highly reflective chrome surface',
    category: 'metal',
    material: {
      color: '#C0C0C0',
      metalness: 1.0,
      roughness: 0.05,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Brushed Steel',
    description: 'Brushed metal with fine scratches',
    category: 'metal',
    material: {
      color: '#8C92AC',
      metalness: 0.9,
      roughness: 0.3,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Gold',
    description: 'Shiny gold material',
    category: 'metal',
    material: {
      color: '#FFD700',
      metalness: 1.0,
      roughness: 0.1,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Copper',
    description: 'Oxidized copper surface',
    category: 'metal',
    material: {
      color: '#B87333',
      metalness: 0.8,
      roughness: 0.4,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },

  // Glass Materials
  {
    name: 'Clear Glass',
    description: 'Transparent clear glass',
    category: 'glass',
    material: {
      color: '#FFFFFF',
      metalness: 0.0,
      roughness: 0.05,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Frosted Glass',
    description: 'Translucent frosted glass',
    category: 'glass',
    material: {
      color: '#F0F8FF',
      metalness: 0.0,
      roughness: 0.8,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },

  // Organic Materials
  {
    name: 'Wood - Oak',
    description: 'Natural oak wood texture',
    category: 'organic',
    material: {
      color: '#DEB887',
      metalness: 0.0,
      roughness: 0.9,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Leather',
    description: 'Worn leather surface',
    category: 'organic',
    material: {
      color: '#8B4513',
      metalness: 0.0,
      roughness: 0.8,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Skin',
    description: 'Human skin material',
    category: 'organic',
    material: {
      color: '#FFDBAC',
      metalness: 0.0,
      roughness: 0.7,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },

  // Fabric Materials
  {
    name: 'Cotton',
    description: 'Soft cotton fabric',
    category: 'fabric',
    material: {
      color: '#F5F5DC',
      metalness: 0.0,
      roughness: 1.0,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Velvet',
    description: 'Luxurious velvet texture',
    category: 'fabric',
    material: {
      color: '#8B008B',
      metalness: 0.0,
      roughness: 0.9,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },

  // Stone Materials
  {
    name: 'Marble',
    description: 'Polished marble surface',
    category: 'stone',
    material: {
      color: '#F8F8FF',
      metalness: 0.0,
      roughness: 0.2,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Concrete',
    description: 'Rough concrete texture',
    category: 'stone',
    material: {
      color: '#808080',
      metalness: 0.0,
      roughness: 0.95,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },
  {
    name: 'Granite',
    description: 'Speckled granite stone',
    category: 'stone',
    material: {
      color: '#2F4F4F',
      metalness: 0.0,
      roughness: 0.7,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  },

  // Special Materials
  {
    name: 'Neon',
    description: 'Glowing neon material',
    category: 'special',
    material: {
      color: '#00FFFF',
      metalness: 0.0,
      roughness: 0.1,
      emissive: '#00FFFF',
      emissiveIntensity: 0.8
    }
  },
  {
    name: 'Holographic',
    description: 'Iridescent holographic surface',
    category: 'special',
    material: {
      color: '#FF1493',
      metalness: 0.8,
      roughness: 0.1,
      emissive: '#FF1493',
      emissiveIntensity: 0.3
    }
  },
  {
    name: 'Carbon Fiber',
    description: 'High-tech carbon fiber weave',
    category: 'special',
    material: {
      color: '#36454F',
      metalness: 0.1,
      roughness: 0.3,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  }
]

interface ShaderPresetsProps {
  onApplyPreset: (material: MaterialProperties) => void
  currentMaterial: MaterialProperties
}

export function ShaderPresets({ onApplyPreset, currentMaterial }: ShaderPresetsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [customMaterial, setCustomMaterial] = useState<MaterialProperties>(currentMaterial)

  const categories = ['all', 'metal', 'organic', 'glass', 'fabric', 'stone', 'special']
  
  const filteredPresets = selectedCategory === 'all' 
    ? shaderPresets 
    : shaderPresets.filter(preset => preset.category === selectedCategory)

  const handleApplyPreset = (preset: ShaderPreset) => {
    onApplyPreset(preset.material)
    setCustomMaterial(preset.material)
  }

  const handleCustomMaterialChange = (property: keyof MaterialProperties, value: any) => {
    const newMaterial = { ...customMaterial, [property]: value }
    setCustomMaterial(newMaterial)
    onApplyPreset(newMaterial)
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <Card className="p-4 space-y-3">
        <h4 className="text-sm font-medium">Material Presets</h4>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="metal">Metals</SelectItem>
            <SelectItem value="organic">Organic</SelectItem>
            <SelectItem value="glass">Glass</SelectItem>
            <SelectItem value="fabric">Fabrics</SelectItem>
            <SelectItem value="stone">Stone</SelectItem>
            <SelectItem value="special">Special Effects</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Preset Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {filteredPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => handleApplyPreset(preset)}
              className="h-auto p-2 flex flex-col items-start text-left"
            >
              <div className="flex items-center gap-2 w-full">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ 
                    backgroundColor: preset.material.color,
                    border: preset.material.metalness > 0.5 ? '1px solid #fff' : '1px solid #ccc'
                  }}
                />
                <span className="text-xs font-medium truncate">{preset.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {preset.description}
              </span>
            </Button>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Advanced Material Editor */}
      <Card className="p-4 space-y-4">
        <h4 className="text-sm font-medium">Advanced Material Properties</h4>
        
        <div className="space-y-4">
          {/* Base Color */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Base Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={customMaterial.color}
                onChange={(e) => handleCustomMaterialChange('color', e.target.value)}
                className="w-8 h-8 rounded border border-border"
              />
              <span className="text-xs text-muted-foreground">{customMaterial.color}</span>
            </div>
          </div>

          {/* Metalness */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Metalness</label>
              <span className="text-xs text-muted-foreground">{customMaterial.metalness.toFixed(2)}</span>
            </div>
            <Slider
              value={[customMaterial.metalness]}
              onValueChange={([value]) => handleCustomMaterialChange('metalness', value)}
              min={0}
              max={1}
              step={0.01}
              className="mt-1"
            />
          </div>

          {/* Roughness */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Roughness</label>
              <span className="text-xs text-muted-foreground">{customMaterial.roughness.toFixed(2)}</span>
            </div>
            <Slider
              value={[customMaterial.roughness]}
              onValueChange={([value]) => handleCustomMaterialChange('roughness', value)}
              min={0}
              max={1}
              step={0.01}
              className="mt-1"
            />
          </div>

          {/* Emissive */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Emissive Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={customMaterial.emissive}
                onChange={(e) => handleCustomMaterialChange('emissive', e.target.value)}
                className="w-8 h-8 rounded border border-border"
              />
              <span className="text-xs text-muted-foreground">{customMaterial.emissive}</span>
            </div>
          </div>

          {/* Emissive Intensity */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Emissive Intensity</label>
              <span className="text-xs text-muted-foreground">{customMaterial.emissiveIntensity.toFixed(2)}</span>
            </div>
            <Slider
              value={[customMaterial.emissiveIntensity]}
              onValueChange={([value]) => handleCustomMaterialChange('emissiveIntensity', value)}
              min={0}
              max={2}
              step={0.01}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Material Preview */}
      <Card className="p-4">
        <h5 className="text-xs font-medium text-muted-foreground mb-2">Material Preview</h5>
        <div className="grid grid-cols-4 gap-1">
          <div 
            className="aspect-square rounded border"
            style={{ 
              backgroundColor: customMaterial.color,
              opacity: 1 - customMaterial.roughness * 0.3,
              boxShadow: customMaterial.metalness > 0.5 ? 'inset 0 0 10px rgba(255,255,255,0.3)' : 'none'
            }}
          />
          <div 
            className="aspect-square rounded border"
            style={{ 
              backgroundColor: customMaterial.emissive,
              opacity: customMaterial.emissiveIntensity
            }}
          />
          <div 
            className="aspect-square rounded border bg-gradient-to-br"
            style={{ 
              background: `linear-gradient(135deg, ${customMaterial.color}, #000000)`
            }}
          />
          <div 
            className="aspect-square rounded border"
            style={{ 
              backgroundColor: customMaterial.color,
              filter: `blur(${customMaterial.roughness * 2}px)`
            }}
          />
        </div>
      </Card>
    </div>
  )
}