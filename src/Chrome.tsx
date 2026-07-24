import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, LayoutGrid, LogOut, User } from 'lucide-react';
import { getAllModules, moduleUrl } from './moduleRegistry';
import type { ChromeLinkProps, ChromeProps, ChromeUser } from './types';

type RenderLink = (props: ChromeLinkProps) => ReactNode;

const BRAND_BLUE = '#005a96';

// Self-contained styles injected once per page — no Tailwind/CSS-build
// dependency required from the host app (manage has Tailwind, the CMS
// doesn't configure it the same way; this works identically in both).
let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-imd-shared-chrome', '');
  style.textContent = `
    .imd-chrome { width: 100%; height: 56px; display: flex; align-items: center; background: ${BRAND_BLUE}; color: #fff; padding: 0 20px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .imd-chrome__brand { font-weight: 600; font-size: 15px; margin-right: 24px; white-space: nowrap; }
    .imd-chrome__spacer { flex: 1; }
    .imd-chrome__btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; }
    .imd-chrome__btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
    .imd-chrome__chev { transition: transform 0.15s ease; }
    .imd-chrome__chev.is-open { transform: rotate(180deg); }
    .imd-chrome__menu-wrap { position: relative; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .imd-chrome__menu { position: absolute; top: calc(100% + 6px); background: #fff; color: #111; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); border: 1px solid rgba(0,0,0,0.08); min-width: 200px; padding: 6px 0; z-index: 1000; }
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

export interface ModuleSwitcherProps {
  currentModuleId: string;
  renderLink?: RenderLink;
  menuAlign?: 'left' | 'right';
}

/** Just the module switcher dropdown — for host apps (like manage) that keep their own brand/logo. */
export function ModuleSwitcher({ currentModuleId, renderLink, menuAlign = 'right' }: ModuleSwitcherProps) {
  ensureStyles();
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const Link = renderLink ?? DefaultLink;
  const modules = getAllModules();
  const current = modules.find((m) => m.id === currentModuleId);

  return (
    <div className="imd-chrome__menu-wrap" ref={ref}>
      <button
        type="button"
        className="imd-chrome__btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <LayoutGrid size={16} />
        {current?.name ?? 'Switch Module'}
        <ChevronDown size={16} className={`imd-chrome__chev${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <div className={`imd-chrome__menu imd-chrome__menu--${menuAlign}`} role="menu">
          <div className="imd-chrome__menu-label">Switch Module</div>
          {modules.map((m) => (
            <Link
              key={m.id}
              href={moduleUrl(m.id)}
              className={`imd-chrome__menu-item${m.id === currentModuleId ? ' is-current' : ''}`}
            >
              <span className={`imd-chrome__dot${m.id === currentModuleId ? ' is-current' : ''}`} />
              {m.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export interface UserMenuProps {
  user: ChromeUser | null | undefined;
  onLogout: () => void;
  accountHref?: string;
  renderLink?: RenderLink;
  menuAlign?: 'left' | 'right';
}

/** Just the user avatar/name + logout dropdown — for host apps that keep their own brand/logo. */
export function UserMenu({ user, onLogout, accountHref, renderLink, menuAlign = 'right' }: UserMenuProps) {
  ensureStyles();
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const Link = renderLink ?? DefaultLink;

  if (user === undefined) return null;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="imd-chrome__menu-wrap" ref={ref}>
      <button
        type="button"
        className="imd-chrome__btn"
        onClick={() => user && setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user ? (
          <>
            {user.avatarUrl ? (
              <img className="imd-chrome__avatar" src={user.avatarUrl} alt="" />
            ) : (
              <span className="imd-chrome__avatar-fallback">{initials}</span>
            )}
            {user.name}
            <ChevronDown size={16} className={`imd-chrome__chev${open ? ' is-open' : ''}`} />
          </>
        ) : (
          <span className="imd-chrome__avatar-fallback">
            <User size={14} />
          </span>
        )}
      </button>
      {open && user && (
        <div className={`imd-chrome__menu imd-chrome__menu--${menuAlign}`} role="menu">
          {accountHref && (
            <Link href={accountHref} className="imd-chrome__menu-item">
              <User size={16} color="#6b7280" />
              My Account
            </Link>
          )}
          {accountHref && <hr className="imd-chrome__divider" />}
          <button
            type="button"
            className="imd-chrome__menu-item"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} color="#6b7280" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * The full shared header bar: brand + module switcher + user menu, all in
 * one. For a host app that doesn't keep its own brand/nav bar (the CMS).
 * Apps that keep their own brand/logo (manage) should use `ModuleSwitcher`
 * and `UserMenu` directly inside their existing header instead.
 */
export function Chrome({ currentModuleId, user, onLogout, accountHref, renderLink }: ChromeProps) {
  ensureStyles();
  return (
    <div className="imd-chrome">
      <div className="imd-chrome__brand">Industrial Machinery Digest</div>
      <div className="imd-chrome__spacer" />
      <ModuleSwitcher currentModuleId={currentModuleId} renderLink={renderLink} />
      <div style={{ marginLeft: 8 }}>
        <UserMenu user={user} onLogout={onLogout} accountHref={accountHref} renderLink={renderLink} />
      </div>
    </div>
  );
}
