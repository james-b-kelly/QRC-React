export type DataType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms'

export interface WiFiFields {
  ssid: string
  password?: string
  encryption?: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface VCardFields {
  firstName: string
  lastName?: string
  phone?: string
  email?: string
  organization?: string
  title?: string
  url?: string
  address?: string
}

export interface EmailFields {
  address: string
  subject?: string
  body?: string
}

export interface SMSFields {
  number: string
  body?: string
}

export function formatURL(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function formatWiFi(fields: WiFiFields): string {
  const enc = fields.encryption ?? 'WPA'
  const hidden = fields.hidden ? 'true' : 'false'
  const escape = (s: string) => s.replace(/[\\;,:"]/g, (c) => `\\${c}`)
  return `WIFI:T:${enc};S:${escape(fields.ssid)};P:${escape(fields.password ?? '')};H:${hidden};;`
}

export function formatVCard(fields: VCardFields): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${fields.lastName ?? ''};${fields.firstName};;;`,
    `FN:${fields.firstName}${fields.lastName ? ` ${fields.lastName}` : ''}`,
  ]
  if (fields.phone) lines.push(`TEL:${fields.phone}`)
  if (fields.email) lines.push(`EMAIL:${fields.email}`)
  if (fields.organization) lines.push(`ORG:${fields.organization}`)
  if (fields.title) lines.push(`TITLE:${fields.title}`)
  if (fields.url) lines.push(`URL:${fields.url}`)
  if (fields.address) lines.push(`ADR:;;${fields.address};;;;`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

export function formatEmail(fields: EmailFields): string {
  const params: string[] = []
  if (fields.subject) params.push(`subject=${encodeURIComponent(fields.subject)}`)
  if (fields.body) params.push(`body=${encodeURIComponent(fields.body)}`)
  const query = params.length > 0 ? `?${params.join('&')}` : ''
  return `mailto:${fields.address}${query}`
}

export function formatPhone(number: string): string {
  return `tel:${number.trim()}`
}

export function formatSMS(fields: SMSFields): string {
  const body = fields.body ? `?body=${encodeURIComponent(fields.body)}` : ''
  return `sms:${fields.number.trim()}${body}`
}

export function formatData(
  type: DataType,
  data: string | WiFiFields | VCardFields | EmailFields | SMSFields,
): string {
  switch (type) {
    case 'url':
      return formatURL(data as string)
    case 'text':
      return (data as string).trim()
    case 'wifi':
      return formatWiFi(data as WiFiFields)
    case 'vcard':
      return formatVCard(data as VCardFields)
    case 'email':
      return formatEmail(data as EmailFields)
    case 'phone':
      return formatPhone(data as string)
    case 'sms':
      return formatSMS(data as SMSFields)
  }
}
