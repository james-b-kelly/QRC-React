import type { ReactNode } from 'react'

interface SectionWrapperProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function SectionWrapper({ title, children, defaultOpen = true }: SectionWrapperProps) {
  return (
    <details open={defaultOpen} className="group border border-gray-200 rounded-lg">
      <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 select-none">
        {title}
        <svg
          className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-4 pb-4 pt-1">
        {children}
      </div>
    </details>
  )
}
