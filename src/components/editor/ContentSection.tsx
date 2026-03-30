import { useEffect, useRef, useState } from 'react'
import type { DataType, WiFiFields, VCardFields, EmailFields, SMSFields } from '../../lib/qr-engine'
import { formatData } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'

const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'vcard', label: 'vCard' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
]

interface ContentSectionProps {
  onDataChange: (data: string) => void
}

export default function ContentSection({ onDataChange }: ContentSectionProps) {
  const [dataType, setDataType] = useState<DataType>('url')
  const [urlValue, setUrlValue] = useState('https://example.com')
  const [textValue, setTextValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [wifiFields, setWifiFields] = useState<WiFiFields>({ ssid: '', password: '', encryption: 'WPA', hidden: false })
  const [vcardFields, setVcardFields] = useState<VCardFields>({ firstName: '' })
  const [emailFields, setEmailFields] = useState<EmailFields>({ address: '' })
  const [smsFields, setSmsFields] = useState<SMSFields>({ number: '' })

  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      let data: string
      switch (dataType) {
        case 'url': data = formatData('url', urlValue); break
        case 'text': data = formatData('text', textValue); break
        case 'phone': data = formatData('phone', phoneValue); break
        case 'wifi': data = formatData('wifi', wifiFields); break
        case 'vcard': data = formatData('vcard', vcardFields); break
        case 'email': data = formatData('email', emailFields); break
        case 'sms': data = formatData('sms', smsFields); break
      }
      onDataChange(data || 'https://example.com')
    }, 150)
    return () => clearTimeout(debounceRef.current)
  }, [dataType, urlValue, textValue, phoneValue, wifiFields, vcardFields, emailFields, smsFields, onDataChange])

  const inputClass = 'w-full h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors'
  const textareaClass = 'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors'
  const labelClass = 'block text-xs font-medium text-slate-500 mb-1.5'

  return (
    <SectionWrapper title="Content">
      <div className="space-y-3">
        <div>
          <label htmlFor="data-type" className={labelClass}>Data type</label>
          <select
            id="data-type"
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className={inputClass}
          >
            {DATA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {dataType === 'url' && (
          <div>
            <label htmlFor="url-input" className={labelClass}>URL</label>
            <input id="url-input" type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} className={inputClass} placeholder="https://example.com" />
          </div>
        )}

        {dataType === 'text' && (
          <div>
            <label htmlFor="text-input" className={labelClass}>Text</label>
            <textarea id="text-input" value={textValue} onChange={(e) => setTextValue(e.target.value)} className={textareaClass} rows={3} placeholder="Enter text..." />
          </div>
        )}

        {dataType === 'phone' && (
          <div>
            <label htmlFor="phone-input" className={labelClass}>Phone number</label>
            <input id="phone-input" type="tel" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} className={inputClass} placeholder="+44 7700 900000" />
          </div>
        )}

        {dataType === 'wifi' && (
          <div className="space-y-2.5">
            <div>
              <label htmlFor="wifi-ssid" className={labelClass}>Network name (SSID)</label>
              <input id="wifi-ssid" value={wifiFields.ssid} onChange={(e) => setWifiFields({ ...wifiFields, ssid: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wifi-password" className={labelClass}>Password</label>
              <input id="wifi-password" type="password" value={wifiFields.password ?? ''} onChange={(e) => setWifiFields({ ...wifiFields, password: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wifi-encryption" className={labelClass}>Encryption</label>
              <select id="wifi-encryption" value={wifiFields.encryption} onChange={(e) => setWifiFields({ ...wifiFields, encryption: e.target.value as WiFiFields['encryption'] })} className={inputClass}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={wifiFields.hidden ?? false} onChange={(e) => setWifiFields({ ...wifiFields, hidden: e.target.checked })} className="rounded border-slate-300" />
              Hidden network
            </label>
          </div>
        )}

        {dataType === 'vcard' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="vcard-first" className={labelClass}>First name</label>
              <input id="vcard-first" value={vcardFields.firstName} onChange={(e) => setVcardFields({ ...vcardFields, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vcard-last" className={labelClass}>Last name</label>
              <input id="vcard-last" value={vcardFields.lastName ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, lastName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vcard-phone" className={labelClass}>Phone</label>
              <input id="vcard-phone" type="tel" value={vcardFields.phone ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vcard-email" className={labelClass}>Email</label>
              <input id="vcard-email" type="email" value={vcardFields.email ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vcard-org" className={labelClass}>Organisation</label>
              <input id="vcard-org" value={vcardFields.organization ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, organization: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vcard-title" className={labelClass}>Title</label>
              <input id="vcard-title" value={vcardFields.title ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, title: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label htmlFor="vcard-url" className={labelClass}>Website</label>
              <input id="vcard-url" type="url" value={vcardFields.url ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, url: e.target.value })} className={inputClass} />
            </div>
          </div>
        )}

        {dataType === 'email' && (
          <div className="space-y-2.5">
            <div>
              <label htmlFor="email-address" className={labelClass}>Email address</label>
              <input id="email-address" type="email" value={emailFields.address} onChange={(e) => setEmailFields({ ...emailFields, address: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="email-subject" className={labelClass}>Subject</label>
              <input id="email-subject" value={emailFields.subject ?? ''} onChange={(e) => setEmailFields({ ...emailFields, subject: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="email-body" className={labelClass}>Body</label>
              <textarea id="email-body" value={emailFields.body ?? ''} onChange={(e) => setEmailFields({ ...emailFields, body: e.target.value })} className={textareaClass} rows={2} />
            </div>
          </div>
        )}

        {dataType === 'sms' && (
          <div className="space-y-2.5">
            <div>
              <label htmlFor="sms-number" className={labelClass}>Phone number</label>
              <input id="sms-number" type="tel" value={smsFields.number} onChange={(e) => setSmsFields({ ...smsFields, number: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="sms-body" className={labelClass}>Message</label>
              <textarea id="sms-body" value={smsFields.body ?? ''} onChange={(e) => setSmsFields({ ...smsFields, body: e.target.value })} className={textareaClass} rows={2} />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
