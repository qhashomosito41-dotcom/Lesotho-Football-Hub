import { SOCIAL_LINKS } from '@/config/social'
import { cn } from '@/utils/cn'

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-2.5', className)}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-navy-300 transition-colors duration-150 hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d={social.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
