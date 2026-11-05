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
  /** Heading this link sits under in its section's menu. */
  group?: string;
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
      { group: 'Accounts', label: 'Advertisers', path: '/imd/crm/advertisers' },
      { group: 'Accounts', label: 'Contacts', path: '/imd/crm/contacts' },
      { group: 'Selling', label: 'Proposals', path: '/imd/crm/proposals' },
      { group: 'Selling', label: 'Directory Campaign', path: '/imd/crm/directory-campaign' },
      { group: 'Selling', label: 'Platinum Upgrades', path: '/imd/pr/platinum-upgrades' },
      { group: 'Selling', label: 'Issue Sales', path: '/imd/crm/issues' },
      { group: 'Billing', label: 'Invoices', path: '/imd/crm/invoices' },
      { group: 'Billing', label: 'Orders', path: '/imd/crm/orders' },
      { group: 'Billing', label: 'Payments', path: '/imd/crm/payments' },
    ],
    matches: ['/imd/crm'],
  },
  content: {
    id: 'content',
    name: 'Content',
    path: '/imd/pr',
    origin: MANAGE_ORIGIN,
    menu: [
      { group: 'Press Releases', label: 'Pipeline Overview', path: '/imd/pr' },
      { group: 'Press Releases', label: 'Import', path: '/imd/pr/import' },
      { group: 'Press Releases', label: 'Extract', path: '/imd/pr/extract' },
      { group: 'Press Releases', label: 'Library', path: '/imd/pr/library' },
      { group: 'Press Releases', label: 'Companies', path: '/imd/pr/companies' },
      { group: 'Press Releases', label: 'Archive', path: '/imd/pr/archive' },
      { group: 'Magazine', label: 'Issue Builder', path: '/imd/pr/ed-board' },
      { group: 'Magazine', label: 'Print Lockup', path: '/imd/crm/lockup' },
      { group: 'Podcast', label: 'Episodes', path: '/imd/pr/podcast' },
      { group: 'Podcast', label: 'Interviews', path: '/imd/interviews' },
      { group: 'Booth Tours', label: 'Booths', path: '/imd/booth-tours' },
      { group: 'Booth Tours', label: 'Trade Shows', path: '/imd/booth-tours/shows' },
      { group: 'Booth Tours', label: 'Approvals', path: '/imd/booth-tours/approvals' },
    ],
    matches: ['/imd/pr'],
  },
  cms: {
    id: 'cms',
    name: 'Website CMS',
    path: '/admin',
    origin: CMS_ORIGIN,
    menu: [
      { label: 'CMS Home', path: '/admin' },
      { label: 'Articles', path: '/admin/collections/articles' },
      { label: 'Media', path: '/admin/collections/media' },
      { label: 'Publications', path: '/admin/collections/publications' },
      { label: 'Suppliers', path: '/admin/collections/suppliers' },
      { label: 'Events', path: '/admin/collections/events' },
    ],
  },
  banners: {
    id: 'banners',
    name: 'Banners',
    path: '/imd/banner-ads/list',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'New Banner', path: '/imd/banner-ads/create' },
      { label: 'All Banners', path: '/imd/banner-ads/list' },
      { label: 'By Client', path: '/imd/banner-ads/clients' },
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
      { group: 'Newsletters', label: 'All Newsletters', path: '/imd/newsletters/issues' },
      { group: 'Newsletters', label: 'New Newsletter', path: '/imd/newsletters/builder' },
      { group: 'Social', label: 'Post Queue', path: '/imd/social/queue' },
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
    path: '/imd/reports',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Platinum Report', path: '/imd/reports?tab=client' },
      { label: 'Banners', path: '/imd/reports?tab=banners' },
      { label: 'Newsletters', path: '/imd/reports?tab=newsletters' },
      { label: 'Presentations', path: '/imd/reports?tab=presentations' },
      { label: 'Podcast', path: '/imd/reports?tab=podcast' },
    ],
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    path: '/imd/settings',
    origin: MANAGE_ORIGIN,
    menu: [
      { group: 'You', label: 'My Account', path: '/imd/settings?section=account' },
      { group: 'People', label: 'Team & Access', path: '/imd/settings?section=team', adminOnly: true },
      { group: 'People', label: 'Sales Reps', path: '/imd/settings?section=reps' },
      { group: 'Content', label: 'PR Intake', path: '/imd/settings?section=pr' },
      { group: 'Email', label: 'ReachMail Lists', path: '/imd/settings?section=email' },
      { group: 'Email', label: 'Preferred Lists', path: '/imd/settings?section=email-preferred' },
      { group: 'Email', label: 'List Folders', path: '/imd/settings?section=email-folders' },
      { group: 'Social', label: 'Social Accounts', path: '/imd/settings?section=social' },
      { group: 'System', label: 'Monitoring', path: '/imd/settings?section=monitoring', adminOnly: true },
      { group: 'System', label: 'Pipelines', path: '/imd/settings?section=pipelines', adminOnly: true },
      { group: 'System', label: 'Workers', path: '/imd/settings?section=workers', adminOnly: true },
      { group: 'System', label: 'Jobs', path: '/imd/settings?section=jobs', adminOnly: true },
      { group: 'System', label: 'Error Logs', path: '/imd/settings?section=errors', adminOnly: true },
      { group: 'System', label: 'Activity', path: '/imd/settings?section=activity', adminOnly: true },
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
