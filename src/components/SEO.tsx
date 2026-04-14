import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description: string
  path: string
  noindex?: boolean
  jsonLd?: object | object[]
}

const SITE_URL = 'https://quirc.store'

export default function SEO({ title, description, path, noindex, jsonLd }: Props) {
  const canonical = `${SITE_URL}${path}`
  const ldBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {ldBlocks.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  )
}
