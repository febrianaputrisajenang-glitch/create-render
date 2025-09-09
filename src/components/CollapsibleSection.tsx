import { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CollapsibleSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function CollapsibleSection({ 
  title, 
  icon, 
  children, 
  isOpen,
  onToggle
}: CollapsibleSectionProps) {

  return (
    <div className="border-b border-border">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      {isOpen && (
        <div className="border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  )
}