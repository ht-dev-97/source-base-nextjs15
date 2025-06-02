import { serverEnv } from '@/configs/env'
import {
  Abolition,
  GeistMono,
  GeistSans,
  SNPro
} from '@/configs/fonts/custom-fonts'
import { locales } from '@/i18n/request'
import { routing } from '@/i18n/routing'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import Header from '@/components/layout/header'
import { ProvidersWrapper } from '@/components/providers/providers-wrapper'
import { Toaster } from '@/components/ui/sonner'

import '../../styles/globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'Layout' })

  return {
    title: t('Metadata.title'),
    description: t('Metadata.description'),
    openGraph: {
      title: t('Metadata.title'),
      description: t('Metadata.description'),
      url: `${serverEnv.API_BASE_URL}`,
      images: [
        {
          url: `${serverEnv.API_BASE_URL}/assets/images/open-graph-thumbnail.jpg`,
          width: 1200,
          height: 630,
          alt: t('Metadata.title')
        }
      ],
      siteName: t('Metadata.title'),
      type: 'website'
    }
  }
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid

  const params = await props.params

  const { locale } = params

  const { children } = props

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${Abolition.variable} ${SNPro.variable} antialiased`}
      >
        <ProvidersWrapper locale={locale} messages={messages}>
          <div className="flex min-h-screen w-full flex-col overflow-hidden">
            <Header />
            <main>{children}</main>
            <Toaster />
          </div>
        </ProvidersWrapper>
      </body>
    </html>
  )
}
