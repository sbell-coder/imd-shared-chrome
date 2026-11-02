import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, LayoutGrid, LogOut, User } from 'lucide-react';
import type { MenuItem, ModuleEntry } from './moduleRegistry';
import { getModule, getSwitcherModules, menuItemHref, moduleLandingHref, moduleUrl, pathMatchesPrefix } from './moduleRegistry';
import type { ChromeLinkProps, ChromeUser } from './types';

type RenderLink = (props: ChromeLinkProps) => ReactNode;

const BRAND_BLUE = '#005a96';
const TOPBAR_HEIGHT = 70;

let stylesInjected = false;

function ensureTopbarStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-imd-topbar', '');
  style.textContent = `
    .imd-topbar {
      align-items: center;
      background: ${BRAND_BLUE};
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-sizing: border-box;
      color: #fff;
      display: flex;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: ${TOPBAR_HEIGHT}px;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 10000;
    }
    .imd-topbar__inner {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      width: 100%;
    }
    .imd-topbar__brand {
      align-items: center;
      display: flex;
      flex-shrink: 0;
      margin-right: 40px;
      text-decoration: none;
    }
    .imd-topbar__logo {
      height: 32px;
      width: auto;
    }
    .imd-topbar__nav {
      align-items: center;
      display: flex;
      flex: 1;
      gap: 24px;
      min-width: 0;
    }
    .imd-topbar__nav-more {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      white-space: nowrap;
    }
    .imd-topbar__nav-more:hover, .imd-topbar__nav-more.is-active { color: #fff; }
    .imd-topbar__nav-link {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
    }
    .imd-topbar__nav-link:hover { color: #fff; }
    .imd-topbar__nav-link.is-active { color: #fff; font-weight: 600; }
    .imd-topbar__icon-btn {
      align-items: center;
      background: transparent;
      border: none;
      border-radius: 999px;
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      height: 36px;
      justify-content: center;
      text-decoration: none;
      width: 36px;
    }
    .imd-topbar__icon-btn:hover {
      background: rgba(255, 255, 255, 1);
      color: #005a96;
    }
    .imd-topbar__tools {
      align-items: center;
      display: flex;
      flex-shrink: 0;
      gap: 16px;
      margin-left: auto;
    }
    @media (max-width: 767px) {
      /* Phones: the text links overlap; the module switcher and account menu still cover navigation. */
      .imd-topbar__nav { display: none; }
      .imd-topbar__inner { padding: 0 12px; }
      .imd-topbar__brand { margin-right: 8px; }
      .imd-topbar__logo { height: 26px; }
      .imd-topbar__tools { gap: 6px; }
      .imd-chrome__user-name { display: none; }
    }
    .imd-chrome__btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; }
    .imd-chrome__btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
    .imd-chrome__chev { transition: transform 0.15s ease; }
    .imd-chrome__chev.is-open { transform: rotate(180deg); }
    .imd-chrome__menu-wrap { position: relative; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .imd-chrome__menu { position: absolute; top: calc(100% + 6px); background: #fff; color: #111; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); border: 1px solid rgba(0,0,0,0.08); min-width: 200px; padding: 6px 0; z-index: 10001; }
    .imd-chrome__menu--left { left: 0; }
    .imd-chrome__menu--right { right: 0; }
    .imd-chrome__menu-label { padding: 8px 14px 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #6b7280; }
    .imd-chrome__menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 14px; font-size: 14px; text-align: left; text-decoration: none; color: #374151; background: none; border: none; cursor: pointer; box-sizing: border-box; font-family: inherit; }
    .imd-chrome__menu-item:hover { background: #f9fafb; }
    .imd-chrome__menu-item.is-current { background: #eff6ff; color: #1d4ed8; font-weight: 500; }
    .imd-chrome__dot { width: 6px; height: 6px; border-radius: 999px; background: #d1d5db; flex-shrink: 0; }
    .imd-chrome__dot.is-current { background: #3b82f6; }
    .imd-chrome__divider { border: none; border-top: 1px solid #f3f4f6; margin: 4px 0; }
    .imd-chrome__avatar { width: 28px; height: 28px; border-radius: 999px; object-fit: cover; }
    .imd-chrome__avatar-fallback { width: 28px; height: 28px; border-radius: 999px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
  `;
  document.head.appendChild(style);
}

function DefaultLink({ href, children, className, title }: ChromeLinkProps) {
  return (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  );
}

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

/** Links with sibling links underneath them only light up on their exact page. */
const EXACT_NAV_PATHS = new Set(['/imd/booth-tours', '/imd/circulation', '/admin']);

function isNavItemActive(itemPath: string, pathname: string): boolean {
  if (EXACT_NAV_PATHS.has(itemPath)) return pathname === itemPath || pathname === `${itemPath}/`;
  return pathMatchesPrefix(pathname, itemPath);
}

export interface ImdTopbarProps {
  currentModuleId: string;
  pathname: string;
  user: ChromeUser | null | undefined;
  onLogout: () => void;
  accountHref?: string;
  renderLink?: RenderLink;
  logoSrc?: string;
  logoAlt?: string;
  toolsSlot?: ReactNode;
}

function ModuleSwitcherInline({ currentModuleId, renderLink, menuAlign = 'right' }: { currentModuleId: string; renderLink?: RenderLink; menuAlign?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const Link = renderLink ?? DefaultLink;
  const modules = getSwitcherModules();
  const current = getModule(currentModuleId);
  return (
    <div className="imd-chrome__menu-wrap" ref={ref}>
      <button type="button" className="imd-chrome__btn" onClick={() => setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open}>
        <LayoutGrid size={16} />
        {current?.name ?? 'Switch Section'}
        <ChevronDown size={16} className={`imd-chrome__chev${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <div className={`imd-chrome__menu imd-chrome__menu--${menuAlign}`} role="menu">
          <div className="imd-chrome__menu-label">Switch Section</div>
          {modules.map((m) => (
            <Link key={m.id} href={moduleLandingHref(m)} className={`imd-chrome__menu-item${m.id === currentModuleId ? ' is-current' : ''}`}>
              <span className={`imd-chrome__dot${m.id === currentModuleId ? ' is-current' : ''}`} />
              {m.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenuInline({ user, onLogout, accountHref, renderLink, menuAlign = 'right' }: { user: ChromeUser | null | undefined; onLogout: () => void; accountHref?: string; renderLink?: RenderLink; menuAlign?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const Link = renderLink ?? DefaultLink;
  if (user === undefined) return null;
  const initials = user?.name ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : '';
  return (
    <div className="imd-chrome__menu-wrap" ref={ref}>
      <button type="button" className="imd-chrome__btn" onClick={() => user && setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open}>
        {user ? (
          <>
            {user.avatarUrl ? <img className="imd-chrome__avatar" src={user.avatarUrl} alt="" /> : <span className="imd-chrome__avatar-fallback">{initials}</span>}
            <span className="imd-chrome__user-name">{user.name}</span>
            <ChevronDown size={16} className={`imd-chrome__chev${open ? ' is-open' : ''}`} />
          </>
        ) : (
          <span className="imd-chrome__avatar-fallback"><User size={14} /></span>
        )}
      </button>
      {open && user && (
        <div className={`imd-chrome__menu imd-chrome__menu--${menuAlign}`} role="menu">
          {accountHref && <Link href={accountHref} className="imd-chrome__menu-item"><User size={16} color="#6b7280" />My Account</Link>}
          {accountHref && <hr className="imd-chrome__divider" />}
          <button type="button" className="imd-chrome__menu-item" onClick={() => { setOpen(false); onLogout(); }}>
            <LogOut size={16} color="#6b7280" />Logout
          </button>
        </div>
      )}
    </div>
  );
}

const MORE_BUTTON_WIDTH = 72;
const NAV_GAP = 24;

/** How many links fit in `available` px; the rest go under More. */
function visibleLinkCount(widths: number[], available: number): number {
  const total = widths.reduce((sum, width) => sum + width + NAV_GAP, -NAV_GAP);
  if (total <= available) return widths.length;
  let used = MORE_BUTTON_WIDTH;
  let count = 0;
  for (const width of widths) {
    used += width + NAV_GAP;
    if (used > available) break;
    count += 1;
  }
  return count;
}

function TopbarNav({ module, pathname, renderLink }: { module: ModuleEntry; pathname: string; renderLink?: RenderLink }) {
  const Link = renderLink ?? DefaultLink;
  const items = module.menu;
  const navRef = useRef<HTMLElement | null>(null);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [available, setAvailable] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useOutsideClick(() => setMoreOpen(false));

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    setWidths(Array.from(nav.children).map((child) => (child as HTMLElement).offsetWidth));
    setAvailable(nav.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setAvailable(nav.clientWidth));
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  const count = widths ? visibleLinkCount(widths, available) : items.length;
  const hidden = items.slice(count);
  const hiddenActive = hidden.some((item) => isNavItemActive(item.path, pathname));
  const renderItem = (item: MenuItem, className: string) => (
    <Link key={item.path} href={menuItemHref(module, item)} className={`${className}${isNavItemActive(item.path, pathname) ? ' is-active' : ''}`}>
      {item.label}
    </Link>
  );

  return (
    <nav className="imd-topbar__nav" ref={navRef}>
      {items.slice(0, count).map((item) => renderItem(item, 'imd-topbar__nav-link'))}
      {hidden.length > 0 && (
        <div className="imd-chrome__menu-wrap" ref={moreRef}>
          <button
            type="button"
            className={`imd-topbar__nav-more${hiddenActive ? ' is-active' : ''}`}
            aria-haspopup="true"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((open) => !open)}
          >
            More
            <ChevronDown size={14} className={`imd-chrome__chev${moreOpen ? ' is-open' : ''}`} />
          </button>
          {moreOpen && (
            <div className="imd-chrome__menu imd-chrome__menu--left" role="menu" onClick={() => setMoreOpen(false)}>
              {hidden.map((item) => renderItem(item, 'imd-chrome__menu-item'))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export function ImdTopbar({ currentModuleId, pathname, user, onLogout, accountHref, renderLink, logoSrc = '/media/logos/imd.svg', logoAlt = 'IMD Logo', toolsSlot }: ImdTopbarProps) {
  ensureTopbarStyles();
  const Link = renderLink ?? DefaultLink;
  const module = getModule(currentModuleId);
  const navItems = module?.menu.filter((item) => item.label !== 'Dashboard' && (!item.adminOnly || user?.isAdmin)) ?? [];
  const logoHref = moduleUrl('home');
  return (
    <header className="imd-topbar">
      <div className="imd-topbar__inner">
        <Link href={logoHref} className="imd-topbar__brand" title="Home">
          <img src={logoSrc} alt={logoAlt} className="imd-topbar__logo" />
        </Link>
        {module ? (
          <TopbarNav
            key={`${module.id}-${navItems.length}`}
            module={{ ...module, menu: navItems }}
            pathname={pathname}
            renderLink={renderLink}
          />
        ) : (
          <nav className="imd-topbar__nav" />
        )}
        <div className="imd-topbar__tools">
          {toolsSlot}
          <ModuleSwitcherInline currentModuleId={currentModuleId} renderLink={renderLink} menuAlign="right" />
          <UserMenuInline user={user} onLogout={onLogout} accountHref={accountHref} renderLink={renderLink} menuAlign="right" />
        </div>
      </div>
    </header>
  );
}

export const IMD_TOPBAR_HEIGHT = TOPBAR_HEIGHT;
