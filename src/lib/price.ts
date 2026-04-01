import { useSyncExternalStore } from 'react'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API_URL || 'https://checkout.qrstudio.store'
const FALLBACK = '$1.99'

const REGION_TO_CURRENCY: Record<string, string> = {
  US: 'USD', CA: 'CAD', GB: 'GBP', AU: 'AUD', NZ: 'NZD',
  EU: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', PT: 'EUR',
  FI: 'EUR', GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', MT: 'EUR', CY: 'EUR',
  HR: 'EUR', JP: 'JPY', CN: 'CNY', KR: 'KRW', IN: 'INR',
  BR: 'BRL', MX: 'MXN', CH: 'CHF', SE: 'SEK', NO: 'NOK',
  DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON',
  BG: 'BGN', HK: 'HKD', SG: 'SGD', TW: 'TWD', TH: 'THB',
  MY: 'MYR', PH: 'PHP', ID: 'IDR', VN: 'VND', ZA: 'ZAR',
  AE: 'AED', SA: 'SAR', IL: 'ILS', TR: 'TRY', RU: 'RUB',
  UA: 'UAH', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
}

function detectCurrency(): string {
  const locale = navigator.language || 'en-US'
  try {
    const region = new Intl.Locale(locale).region?.toUpperCase()
    if (region && REGION_TO_CURRENCY[region]) {
      return REGION_TO_CURRENCY[region]
    }
  } catch {
    // Malformed locale, fall through
  }
  return 'USD'
}

let formatted: string = FALLBACK
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return formatted
}

const locale = navigator.language || 'en-US'

function formatWith(amount: number, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    trailingZeroDisplay: 'stripIfInteger',
  }).format(amount)
}

// Fetch real price from Stripe; fall back to locale-detected currency
fetch(`${CHECKOUT_API}/api/price`)
  .then((res) => (res.ok ? res.json() : Promise.reject()))
  .then(({ amount, currency }: { amount: number; currency: string }) => {
    formatted = formatWith(amount, currency.toUpperCase())
    listeners.forEach((l) => l())
  })
  .catch(() => {
    formatted = formatWith(1.99, detectCurrency())
    listeners.forEach((l) => l())
  })

/** Returns the formatted price string, e.g. "$1.99", "A$1.99", "£1.99" */
export function usePrice(): string {
  return useSyncExternalStore(subscribe, getSnapshot)
}
