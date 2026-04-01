import { useSyncExternalStore } from 'react'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API_URL || 'https://checkout.qrstudio.store'
const FALLBACK = '$1.99'

let formatted: string = FALLBACK
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return formatted
}

// Fetch the real price from Stripe once at startup
fetch(`${CHECKOUT_API}/api/price`)
  .then((res) => (res.ok ? res.json() : Promise.reject()))
  .then(({ amount, currency }: { amount: number; currency: string }) => {
    const locale = navigator.language || 'en-US'
    formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      trailingZeroDisplay: 'stripIfInteger',
    }).format(amount)
    listeners.forEach((l) => l())
  })
  .catch(() => {
    // Keep fallback on error
  })

/** Returns the formatted price string, e.g. "$1.99", "A$1.99", "€1.99" */
export function usePrice(): string {
  return useSyncExternalStore(subscribe, getSnapshot)
}
