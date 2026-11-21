import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/app'
import { FOOTER_CLUB_LINKS, FOOTER_COMPETITION_LINKS } from '@/config/navigation'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'

function ColumnHeading({ children }: { children: string }) {
  return <h3 className="text-xs font-semibold tracking-[0.12em] text-white uppercase">{children}</h3>
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="text-sm text-navy-300 transition-colors duration-150 hover:text-white">
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-header">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo />
            <p className="body-muted mt-4 max-w-xs text-navy-300">
              The national home of Lesotho football — live matches, tables, clubs, players and statistics in
              one place.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          <div className="lg:col-span-3">
            <ColumnHeading>About the platform</ColumnHeading>
            <p className="body-muted mt-3 text-navy-300">
              Lesotho Football Hub is a national football information platform delivering accurate, timely
              match data for supporters, clubs and officials.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <FooterLink to={ROUTES.about}>About LFH</FooterLink>
              <FooterLink to={ROUTES.contact}>Contact the team</FooterLink>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ColumnHeading>Competitions</ColumnHeading>
            <div className="mt-3 flex flex-col gap-2">
              {FOOTER_COMPETITION_LINKS.map((item) => (
                <FooterLink key={item.to} to={item.to}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ColumnHeading>Club directory</ColumnHeading>
            <div className="mt-3 flex flex-col gap-2">
              {FOOTER_CLUB_LINKS.map((item) => (
                <FooterLink key={item.to} to={item.to}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ColumnHeading>Contact</ColumnHeading>
            <div className="mt-3 flex flex-col gap-2.5">
              <a
                href="mailto:info@lesothofootballhub.co.ls"
                className="flex items-center gap-2 text-sm text-navy-300 transition-colors duration-150 hover:text-white"
              >
                <Mail className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">info@lesothofootballhub.co.ls</span>
              </a>
              <a
                href="tel:+26622000000"
                className="flex items-center gap-2 text-sm text-navy-300 transition-colors duration-150 hover:text-white"
              >
                <Phone className="size-3.5 shrink-0" aria-hidden />
                +266 2200 0000
              </a>
              <p className="flex items-start gap-2 text-sm text-navy-300">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Maseru, Lesotho
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="caption text-navy-400">
            © {new Date().getFullYear()} Lesotho Football Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to={ROUTES.privacy} className="caption text-navy-400 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to={ROUTES.terms} className="caption text-navy-400 transition-colors hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
