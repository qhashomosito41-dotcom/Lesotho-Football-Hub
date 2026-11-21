import type { ComponentType } from 'react'
import { FileText, Info, Lock, Mail, Newspaper, Scale } from 'lucide-react'
import { ROUTES } from './app'

export interface PlaceholderPageConfig {
  path: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  paramLabel?: string
}

export const PLACEHOLDER_PAGES: PlaceholderPageConfig[] = [
  {
    path: ROUTES.news,
    title: 'News',
    description: 'Football news, official announcements and competition updates from across Lesotho.',
    icon: Newspaper,
  },
  {
    path: ROUTES.about,
    title: 'About',
    description: 'About the Lesotho Football Hub platform and its mission for national football.',
    icon: Info,
  },
  {
    path: ROUTES.contact,
    title: 'Contact',
    description: 'Get in touch with the LFH team for data, partnerships and support.',
    icon: Mail,
  },
  {
    path: ROUTES.privacy,
    title: 'Privacy Policy',
    description: 'How Lesotho Football Hub collects, uses and protects your data.',
    icon: Lock,
  },
  {
    path: ROUTES.terms,
    title: 'Terms & Conditions',
    description: 'The terms governing your use of the Lesotho Football Hub platform.',
    icon: Scale,
  },
]

export const PLACEHOLDER_ROUTES = PLACEHOLDER_PAGES.map((page) => ({ path: page.path }))

export const NOT_FOUND_PAGE: Omit<PlaceholderPageConfig, 'path'> = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist or has moved.',
  icon: FileText,
}
