import type { ReactNode } from 'react'

interface SectionWrapperProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function SectionWrapper({ title, children, defaultOpen = true }: SectionWrapperProps) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex items-center justify-between cursor-pointer min-h-[44px] py-2 text-xs font-semibold text-slate-400 uppercase tracking-widest select-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none rounded">
        {title}
        <span className="flex items-center justify-center w-8 h-8">
          <svg
            aria-hidden="true"
            className="w-4 h-4 text-slate-300 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="pt-2.5">
        {children}
      </div>
    </details>
  )
}
