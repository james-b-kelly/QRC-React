import type { ContainerOptions } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'
import SliderRow from './SliderRow'

interface ContainerSectionProps {
  container: ContainerOptions | undefined
  onChange: (container: ContainerOptions) => void
}

export default function ContainerSection({ container, onChange }: ContainerSectionProps) {
  function update(updates: Partial<ContainerOptions>) {
    onChange({ ...container, ...updates })
  }

  const isTransparent = container?.backgroundColor === 'transparent'

  return (
    <SectionWrapper title="Background">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <ColorPicker
            color={isTransparent ? '#FFFFFF' : (container?.backgroundColor ?? '#FFFFFF')}
            onChange={(backgroundColor) => update({ backgroundColor })}
          />
          <label className="flex items-center gap-2 min-h-[44px] text-xs font-medium text-slate-500 cursor-pointer shrink-0 ml-3">
            <input
              type="checkbox"
              checked={isTransparent}
              onChange={(e) => update({ backgroundColor: e.target.checked ? 'transparent' : '#FFFFFF' })}
              className="size-4 rounded border-slate-300"
            />
            None
          </label>
        </div>

        <SliderRow
          label="Opacity"
          value={container?.backgroundOpacity ?? 1}
          displayValue={`${Math.round((container?.backgroundOpacity ?? 1) * 100)}%`}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => update({ backgroundOpacity: v })}
        />
        <SliderRow
          label="Radius"
          value={container?.cornerRadius ?? 0}
          displayValue={`${Math.round((container?.cornerRadius ?? 0) * 100)}%`}
          min={0}
          max={0.15}
          step={0.005}
          onChange={(v) => update({ cornerRadius: v })}
        />
        <SliderRow
          label="Border"
          value={container?.borderWidth ?? 0}
          displayValue={`${Math.round((container?.borderWidth ?? 0) * 100)}%`}
          min={0}
          max={0.10}
          step={0.004}
          onChange={(v) => update({ borderWidth: v })}
        />
        {(container?.borderWidth ?? 0) > 0 && (
          <ColorPicker
            color={container?.borderColor ?? '#000000'}
            onChange={(borderColor) => update({ borderColor })}
            label="Stroke"
          />
        )}
        <SliderRow
          label="Padding"
          value={container?.padding ?? 0}
          displayValue={`${Math.round((container?.padding ?? 0) * 100)}%`}
          min={0}
          max={0.10}
          step={0.005}
          onChange={(v) => update({ padding: v })}
        />
      </div>
    </SectionWrapper>
  )
}
