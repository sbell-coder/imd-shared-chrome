/**
 * Module Registry — SINGLE SOURCE OF TRUTH for every IMD internal app/module
 * and the top-level sections shown in the shared switcher.
 *
 * Previously this list existed twice (metronic-ui's moduleRegistry.ts and a
 * hand-copied MODULES array in the CMS's CmsHeader.tsx) and had to be kept in
 * sync by hand — it drifted. Both apps now import this one file.
 *
 * Sections are organised by the job people are doing, not by how the code is
 * built, so a section's menu can link to pages whose URLs live under another
 * area (Reports links to /imd/banner-ads/reports). Old URLs keep working.
 * `sectionForPath` picks the section for a URL: the longest matching menu path
 * or `matches` prefix wins.
 */

export interface MenuItem {
  label: string;
  path: string;
  /** Only shown to admins. Hides the link; the page and API do their own checks. */
  adminOnly?: boolean;
}

export interface ModuleEntry {
  id: string;
  name: string;
  /** Path (relative, resolved against `origin`) to this module's landing page. */
  path: string;
  /** Absolute origin this module is served from, e.g. 'https://manage.industrialmachinerydigest.com'. */
  origin: string;
  menu: MenuItem[];
  /** URL prefixes that belong to this section without having a menu link of their own. */
  matches?: string[];
  /** false keeps it out of the switcher (it is reached from another section's menu). */
  inSwitcher?: boolean;
}

export const MANAGE_ORIGIN = 'https://manage.industrialmachinerydigest.com';
export const CMS_ORIGIN = 'https://cms.industrialmachinerydigest.com';

export const moduleRegistry: Record<string, ModuleEntry> = {
  home: {
    id: 'home',
    name: 'Home',
    path: '/imd/home',
    origin: MANAGE_ORIGIN,
    menu: [],
    matches: ['/imd/ops'],
  },
  clients: {
    id: 'clients',
    name: 'Clients',
    path: '/imd/crm/advertisers',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Advertisers', path: '/imd/crm/advertisers' },
      { label: 'Contacts', path: '/imd/crm/contacts' },
      { label: 'Proposals', path: '/imd/crm/proposals' },
      { label: 'Orders', path: '/imd/crm/orders' },
      { label: 'Invoices', path: '/imd/crm/invoices' },
      { label: 'Payments', path: '/imd/crm/payments' },
      { label: 'Issue Sales', path: '/imd/crm/issues' },
      { label: 'Lockup', path: '/imd/crm/lockup' },
      { label: 'Campaign', path: '/imd/crm/directory-campaign' },
      { label: 'Platinum', path: '/imd/pr/platinum-upgrades' },
    ],
    matches: ['/imd/crm'],
  },
  content: {
    id: 'content',
    name: 'Content',
    path: '/imd/pr',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Import', path: '/imd/pr/import' },
      { label: 'Extract', path: '/imd/pr/extract' },
      { label: 'Library', path: '/imd/pr/library' },
      { label: 'Issue Builder', path: '/imd/pr/ed-board' },
      { label: 'Podcast', path: '/imd/pr/podcast' },
      { label: 'Booth Tours', path: '/imd/booth-tours' },
      { label: 'Trade Shows', path: '/imd/booth-tours/shows' },
      { label: 'Approvals', path: '/imd/booth-tours/approvals' },
      { label: 'Companies', path: '/imd/pr/companies' },
      { label: 'Archive', path: '/imd/pr/archive' },
      { label: 'Website CMS', path: `${CMS_ORIGIN}/admin` },
    ],
    matches: ['/imd/pr'],
  },
  banners: {
    id: 'banners',
    name: 'Banners',
    path: '/imd/banner-ads/list',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Banners', path: '/imd/banner-ads/list' },
      { label: 'Clients', path: '/imd/banner-ads/clients' },
      { label: 'Campaigns', path: '/imd/banner-ads/campaigns' },
      { label: 'Zones', path: '/imd/banner-ads/zones' },
    ],
    matches: ['/imd/banner-ads'],
  },
  publishing: {
    id: 'publishing',
    name: 'Publishing',
    path: '/imd/newsletters/issues',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Newsletters', path: '/imd/newsletters/issues' },
      { label: 'Templates', path: '/imd/newsletters/templates' },
      { label: 'Social Queue', path: '/imd/social/queue' },
      { label: 'Media Library', path: '/imd/social/media' },
    ],
    matches: ['/imd/newsletters', '/imd/social'],
  },
  circulation: {
    id: 'circulation',
    name: 'Circulation',
    path: '/imd/circulation',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Overview', path: '/imd/circulation' },
      { label: 'Print', path: '/imd/circulation/print' },
      { label: 'Email', path: '/imd/circulation/email' },
      { label: 'Subscribers', path: '/imd/newsletters/subscribers' },
      { label: 'Social', path: '/imd/circulation/social' },
      { label: 'Website', path: '/imd/circulation/website' },
      { label: 'Data Quality', path: '/imd/circulation/data-quality' },
    ],
  },
  reports: {
    id: 'reports',
    name: 'Reports',
    path: '/imd/ops/reports',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Client Reports', path: '/imd/ops/reports' },
      { label: 'Banners', path: '/imd/banner-ads/reports' },
      { label: 'Banner Creatives', path: '/imd/banner-ads/creatives' },
      { label: 'Newsletters', path: '/imd/newsletters/reachmail' },
      { label: 'Social', path: '/imd/social/analytics' },
      { label: 'Presentations', path: '/imd/crm/presentation-analytics' },
    ],
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    path: '/user-settings',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'My Account', path: '/user-settings' },
      { label: 'Team & Access', path: '/imd/ops/users', adminOnly: true },
      { label: 'Sales Reps', path: '/imd/crm/reps' },
      { label: 'PR Intake', path: '/imd/pr/settings' },
      { label: 'Email', path: '/imd/newsletters/reachmail/settings' },
      { label: 'Social Accounts', path: '/imd/social/accounts' },
      { label: 'Monitoring', path: '/imd/orchestrator/monitoring', adminOnly: true },
      { label: 'Pipelines', path: '/imd/orchestrator/pipelines', adminOnly: true },
      { label: 'Workers', path: '/imd/orchestrator/workers', adminOnly: true },
      { label: 'Jobs', path: '/imd/orchestrator/jobs', adminOnly: true },
      { label: 'Errors', path: '/errors', adminOnly: true },
      { label: 'Activity', path: '/imd/activity', adminOnly: true },
    ],
    matches: [
      '/imd/orchestrator',
      '/imd/newsletters/reachmail/preferred',
      '/imd/newsletters/reachmail/folders',
    ],
  },
  cms: {
    id: 'cms',
    name: 'Website CMS',
    path: '/admin',
    origin: CMS_ORIGIN,
    inSwitcher: false,
    menu: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Articles', path: '/admin/collections/articles' },
      { label: 'Media', path: '/admin/collections/media' },
      { label: 'Publications', path: '/admin/collections/publications' },
      { label: 'Suppliers', path: '/admin/collections/suppliers' },
      { label: 'Events', path: '/admin/collections/events' },
    ],
  },
};

export const getModule = (id: string): ModuleEntry | undefined => moduleRegistry[id];
export const getAllModules = (): ModuleEntry[] => Object.values(moduleRegistry);
/** The sections people pick from in the switcher. */
export const getSwitcherModules = (): ModuleEntry[] =>
  getAllModules().filter((mod) => mod.inSwitcher !== false);

/** True when `pathname` is `prefix` or a page underneath it. */
export const pathMatchesPrefix = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * The Manage section a URL belongs to: the longest matching menu path or
 * `matches` prefix wins, so /imd/banner-ads/reports is Reports while the rest of
 * /imd/banner-ads is Banners. Undefined for pages that belong to no section
 * (tickets, notifications, search), which keep the section you came from.
 */
export const sectionForPath = (pathname: string): ModuleEntry | undefined => {
  let best: ModuleEntry | undefined;
  let bestLength = -1;
  for (const mod of getAllModules()) {
    if (mod.origin !== MANAGE_ORIGIN) continue;
    const prefixes = [mod.path, ...mod.menu.map((item) => item.path), ...(mod.matches ?? [])];
    for (const prefix of prefixes) {
      if (prefix.startsWith('/') && prefix.length > bestLength && pathMatchesPrefix(pathname, prefix)) {
        best = mod;
        bestLength = prefix.length;
      }
    }
  }
  return best;
};

/** Absolute URL for a module's landing/dashboard page. */
export const moduleLandingHref = (mod: ModuleEntry): string => `${mod.origin}${mod.path}`;

/** Absolute URL for a menu item within a module. */
export const menuItemHref = (mod: ModuleEntry, item: MenuItem): string => {
  if (item.path.startsWith('http://') || item.path.startsWith('https://')) {
    return item.path;
  }
  return `${mod.origin}${item.path}`;
};

/** Full absolute URL for a module's landing page — always safe to use in a plain <a href>. */
export const moduleUrl = (id: string): string => {
  const mod = moduleRegistry[id];
  if (!mod) return MANAGE_ORIGIN;
  return moduleLandingHref(mod);
};
