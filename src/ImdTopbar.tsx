import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, LayoutGrid, LogOut, User } from 'lucide-react';
import type { MenuItem, ModuleEntry } from './moduleRegistry';
import { getSwitcherModules, menuItemHref, moduleLandingHref, moduleUrl, pathMatchesPrefix } from './moduleRegistry';
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
      align-items: center;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      gap: 3px;
      padding: 0;
      white-space: nowrap;
    }
    .imd-topbar__nav-more:hover, .imd-topbar__nav-more.is-open { color: #fff; }
    .imd-topbar__nav a.imd-topbar__nav-link { font-size: 14px; font-weight: 500; line-height: normal; }
    .imd-topbar__nav-more.is-active, .imd-topbar__nav a.imd-topbar__nav-link.is-active { color: #fff; font-weight: 600; box-shadow: 0 2px 0 #fff; }
    .imd-topbar__panel { max-height: calc(100dvh - 72px); overflow-y: auto; }
    .imd-chrome__menu.imd-topbar__panel--wide { column-count: 2; column-gap: 0; width: 440px; }
    .imd-topbar__panel .imd-chrome__menu-item, .imd-topbar__panel .imd-chrome__menu-label { box-sizing: border-box; white-space: nowrap; }
    .imd-topbar__panel-group { break-inside: avoid; }
    .imd-chrome__menu-wrap.imd-topbar__compact { display: none; }
    @media (max-width: 1099px) {
      /* Too narrow for every section in one row: the same menu goes under one button. */
      .imd-topbar__nav { visibility: hidden; flex: 0 0 0; overflow: hidden; }
      .imd-chrome__menu-wrap.imd-topbar__compact { display: inline-block; }
    }
    .imd-topbar__nav-link:hover { color: #fff; }
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

interface VisibleSection {
  section: ModuleEntry;
  items: MenuItem[];
}

/** Links with sibling links underneath them only light up on their exact page. */
const EXACT_NAV_PATHS = new Set(['/imd/pr', '/imd/booth-tours', '/imd/circulation', '/imd/newsletters/issues']);

/** `location` is the path plus any query, since Reports and Settings pick their tab with one. */
function isItemCurrent(itemPath: string, location: string): boolean {
  const pathname = location.split('?')[0];
  if (itemPath.includes('?')) return location.startsWith(itemPath);
  if (EXACT_NAV_PATHS.has(itemPath)) return pathname === itemPath;
  return pathMatchesPrefix(pathname, itemPath);
}

export interface ImdTopbarProps {
  currentModuleId: string;
  pathname: string;
  /** Query string, so tabs chosen by query can be shown as current. */
  search?: string;
  user: ChromeUser | null | undefined;
  onLogout: () => void;
  accountHref?: string;
  renderLink?: RenderLink;
  logoSrc?: string;
  logoAlt?: string;
  toolsSlot?: ReactNode;
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

type SectionLinksProps = {
  section: ModuleEntry;
  items: MenuItem[];
  location: string;
  renderLink?: RenderLink;
};

/** One section's links, under their group headings. */
function SectionLinks({ section, items, location, renderLink }: SectionLinksProps) {
  const Link = renderLink ?? DefaultLink;
  const groups = items.reduce<Array<{ label?: string; items: MenuItem[] }>>((all, item) => {
    const last = all[all.length - 1];
    if (last && last.label === item.group) return [...all.slice(0, -1), { ...last, items: [...last.items, item] }];
    return [...all, { label: item.group, items: [item] }];
  }, []);
  return (
    <>
      {groups.map((group) => (
        <div key={group.label ?? section.id} className="imd-topbar__panel-group">
          {group.label && <div className="imd-chrome__menu-label">{group.label}</div>}
          {group.items.map((item) => (
            <Link
              key={item.path}
              href={menuItemHref(section, item)}
              className={`imd-chrome__menu-item${isItemCurrent(item.path, location) ? ' is-current' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}

const WIDE_SECTION_LINKS = 12;

function TopbarNav({ sections, currentId, location, renderLink }: { sections: VisibleSection[]; currentId: string; location: string; renderLink?: RenderLink }) {
  const Link = renderLink ?? DefaultLink;
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useOutsideClick(() => setOpenId(null));

  return (
    <div
      ref={ref}
      className="imd-topbar__nav"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpenId(null);
      }}
    >
      {sections.map(({ section, items }) => {
        const isCurrent = section.id === currentId;
        if (items.length === 0) {
          return (
            <Link key={section.id} href={moduleLandingHref(section)} className={`imd-topbar__nav-link${isCurrent ? ' is-active' : ''}`}>
              {section.name}
            </Link>
          );
        }
        const isOpen = openId === section.id;
        return (
          <div key={section.id} className="imd-chrome__menu-wrap">
            <button
              type="button"
              className={`imd-topbar__nav-more${isCurrent ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : section.id)}
              onMouseEnter={() => {
                if (openId) setOpenId(section.id);
              }}
            >
              {section.name}
              <ChevronDown size={14} className={`imd-chrome__chev${isOpen ? ' is-open' : ''}`} />
            </button>
            {isOpen && (
              <div
                className={`imd-chrome__menu imd-chrome__menu--left imd-topbar__panel${items.length >= WIDE_SECTION_LINKS ? ' imd-topbar__panel--wide' : ''}`}
                onClick={() => setOpenId(null)}
              >
                <SectionLinks section={section} items={items} location={location} renderLink={renderLink} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Below 1100px every section sits under one Menu button. */
function CompactMenu({ sections, location, renderLink }: { sections: VisibleSection[]; location: string; renderLink?: RenderLink }) {
  const Link = renderLink ?? DefaultLink;
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  return (
    <div className="imd-chrome__menu-wrap imd-topbar__compact" ref={ref}>
      <button type="button" className="imd-chrome__btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <LayoutGrid size={16} />
        Menu
        <ChevronDown size={16} className={`imd-chrome__chev${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <div className="imd-chrome__menu imd-chrome__menu--right imd-topbar__panel" onClick={() => setOpen(false)}>
          {sections.map(({ section, items }) => (
            <div key={section.id}>
              {items.length === 0 ? (
                <Link href={moduleLandingHref(section)} className="imd-chrome__menu-item">{section.name}</Link>
              ) : (
                <>
                  <div className="imd-chrome__menu-item"><strong>{section.name}</strong></div>
                  <SectionLinks section={section} items={items} location={location} renderLink={renderLink} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImdTopbar({ currentModuleId, pathname, search = '', user, onLogout, accountHref, renderLink, logoSrc = '/media/logos/imd.svg', logoAlt = 'IMD Logo', toolsSlot }: ImdTopbarProps) {
  ensureTopbarStyles();
  const Link = renderLink ?? DefaultLink;
  const location = `${pathname}${search}`;
  const logoHref = moduleUrl('home');
  const sections: VisibleSection[] = getSwitcherModules().map((section) => ({
    section,
    items: section.menu.filter((item) => !item.adminOnly || user?.isAdmin),
  }));
  // The CMS sits under Content in the menu.
  const currentId = currentModuleId === 'cms' ? 'content' : currentModuleId;
  return (
    <header className="imd-topbar">
      <div className="imd-topbar__inner">
        <Link href={logoHref} className="imd-topbar__brand" title="Home">
          <img src={logoSrc} alt={logoAlt} className="imd-topbar__logo" />
        </Link>
        <TopbarNav sections={sections} currentId={currentId} location={location} renderLink={renderLink} />
        <div className="imd-topbar__tools">
          {toolsSlot}
          <CompactMenu sections={sections} location={location} renderLink={renderLink} />
          <UserMenuInline user={user} onLogout={onLogout} accountHref={accountHref} renderLink={renderLink} menuAlign="right" />
        </div>
      </div>
    </header>
  );
}

export const IMD_TOPBAR_HEIGHT = TOPBAR_HEIGHT;
