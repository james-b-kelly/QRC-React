import { useCallback, useEffect, useRef, useState } from 'react'

interface ShareButtonProps {
  hasLogo?: boolean
}

export default function ShareButton({ hasLogo }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      const input = document.createElement('input')
      input.style.position = 'absolute'
      input.style.left = '-9999px'
      input.value = window.location.href
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleCopy}
        className="w-full h-10 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Link copied!
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.02a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
            </svg>
            Copy style link
          </>
        )}
      </button>
      {hasLogo && (
        <p className="text-[11px] text-amber-600 text-center">
          Logo won't be included in the link
        </p>
      )}
    </div>
  )
}
