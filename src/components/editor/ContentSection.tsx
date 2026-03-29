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

  const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none'
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <SectionWrapper title="Content">
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Data type</label>
          <select
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
            <label className={labelClass}>URL</label>
            <input type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} className={inputClass} placeholder="https://example.com" />
          </div>
        )}

        {dataType === 'text' && (
          <div>
            <label className={labelClass}>Text</label>
            <textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} className={inputClass} rows={3} placeholder="Enter text..." />
          </div>
        )}

        {dataType === 'phone' && (
          <div>
            <label className={labelClass}>Phone number</label>
            <input type="tel" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} className={inputClass} placeholder="+44 7700 900000" />
          </div>
        )}

        {dataType === 'wifi' && (
          <div className="space-y-2">
            <div>
              <label className={labelClass}>Network name (SSID)</label>
              <input value={wifiFields.ssid} onChange={(e) => setWifiFields({ ...wifiFields, ssid: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" value={wifiFields.password ?? ''} onChange={(e) => setWifiFields({ ...wifiFields, password: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Encryption</label>
              <select value={wifiFields.encryption} onChange={(e) => setWifiFields({ ...wifiFields, encryption: e.target.value as WiFiFields['encryption'] })} className={inputClass}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={wifiFields.hidden ?? false} onChange={(e) => setWifiFields({ ...wifiFields, hidden: e.target.checked })} className="rounded" />
              Hidden network
            </label>
          </div>
        )}

        {dataType === 'vcard' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>First name</label>
              <input value={vcardFields.firstName} onChange={(e) => setVcardFields({ ...vcardFields, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input value={vcardFields.lastName ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, lastName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={vcardFields.phone ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input value={vcardFields.email ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Organisation</label>
              <input value={vcardFields.organization ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, organization: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input value={vcardFields.title ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, title: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Website</label>
              <input value={vcardFields.url ?? ''} onChange={(e) => setVcardFields({ ...vcardFields, url: e.target.value })} className={inputClass} />
            </div>
          </div>
        )}

        {dataType === 'email' && (
          <div className="space-y-2">
            <div>
              <label className={labelClass}>Email address</label>
              <input type="email" value={emailFields.address} onChange={(e) => setEmailFields({ ...emailFields, address: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subject</label>
              <input value={emailFields.subject ?? ''} onChange={(e) => setEmailFields({ ...emailFields, subject: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea value={emailFields.body ?? ''} onChange={(e) => setEmailFields({ ...emailFields, body: e.target.value })} className={inputClass} rows={2} />
            </div>
          </div>
        )}

        {dataType === 'sms' && (
          <div className="space-y-2">
            <div>
              <label className={labelClass}>Phone number</label>
              <input type="tel" value={smsFields.number} onChange={(e) => setSmsFields({ ...smsFields, number: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea value={smsFields.body ?? ''} onChange={(e) => setSmsFields({ ...smsFields, body: e.target.value })} className={inputClass} rows={2} />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
