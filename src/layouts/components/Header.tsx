import { Menu, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AuthButton } from '@/components/auth'
import { LiveIndicator } from './LiveIndicator'
import { Logo } from './Logo'
import { MainNav } from './MainNav'
import { MobileMenu } from './MobileMenu'
import { SearchDialog } from './SearchDialog'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo />

          <div className="ml-auto flex items-center gap-2">
            <LiveIndicator />

            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-sm text-navy-200 transition-colors duration-150 hover:border-white/25 hover:text-white sm:px-3"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-navy-400 lg:inline">
                Ctrl K
              </kbd>
            </button>

            <AuthButton className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={openMenu}
              aria-label="Open navigation menu"
              className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-navy-200 transition-colors duration-150 hover:border-white/25 hover:text-white lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-white/10 bg-elevated lg:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <MainNav />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} onSearch={() => { closeMenu(); openSearch() }} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  )
}
