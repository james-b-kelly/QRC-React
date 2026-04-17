import type { ReactNode } from 'react'

interface SectionWrapperProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function SectionWrapper({ title, children, defaultOpen = true }: SectionWrapperProps) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex items-center justify-between cursor-pointer min-h-[44px] py-1.5 select-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none rounded">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="flex items-center justify-center size-8">
          <svg
            aria-hidden="true"
            className="size-4 text-slate-400 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="pt-2">
        {children}
      </div>
    </details>
  )
}
