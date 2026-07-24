import type { ReactNode } from 'react';

/** Resolved identity the host app hands to the header — the header never reads auth itself. */
export interface ChromeUser {
  name: string;
  email: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

export interface ChromeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

export interface ChromeProps {
  /** id from moduleRegistry for the module currently being viewed, for switcher highlighting. */
  currentModuleId: string;
  /**
   * Resolved user, or `null` if the header should render a logged-out state
   * (brand + switcher only, no user menu). Pass `undefined` while auth is
   * still resolving to render nothing for the user-menu slot rather than a
   * flash of "logged out."
   */
  user: ChromeUser | null | undefined;
  onLogout: () => void;
  /** Absolute or relative URL for "My Account" — omit to hide that menu item. */
  accountHref?: string;
  /**
   * Override how a module link renders. Default is a plain <a> (a real
   * navigation, correct for cross-app links). A host app that wants
   * same-origin modules to use its own client-side router (e.g. manage
   * switching between its own /imd/pr and /imd/crm without a full reload)
   * should supply a component using its router's Link here.
   */
  renderLink?: (props: ChromeLinkProps) => ReactNode;
}
