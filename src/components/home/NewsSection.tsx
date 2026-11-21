import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/app'
import { LATEST_NEWS } from '@/config/homepage'
import { SectionHeading } from './SectionHeading'

interface NewsSectionProps {
  className?: string
}

export function NewsSection({ className }: NewsSectionProps) {
  return (
    <section className={className} aria-label="Latest football news">
      <SectionHeading
        title="Latest news"
        description="Announcements and stories from across Lesotho football."
        to={ROUTES.news}
        linkLabel="All news"
      />
      <ul className="space-y-2.5">
        {LATEST_NEWS.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              className="group block rounded-xl border border-line bg-surface p-4 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-raised"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary-soft px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
                  {item.category}
                </span>
                <span className="caption">{item.date}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="body-muted mt-1 line-clamp-2">{item.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
