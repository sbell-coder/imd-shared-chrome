/**
 * Module Registry — SINGLE SOURCE OF TRUTH for every IMD internal app/module
 * and the top-level modules shown in the shared switcher.
 *
 * Previously this list existed twice (metronic-ui's moduleRegistry.ts and a
 * hand-copied MODULES array in the CMS's CmsHeader.tsx) and had to be kept in
 * sync by hand — it drifted. Both apps now import this one file.
 *
 * `path` is used two ways depending on where the module lives:
 *  - `origin: 'self'` modules are same-app SPA routes (only meaningful within
 *    manage, which owns /imd/pr, /imd/crm, etc.)
 *  - `origin` set to an absolute URL means the module is a different deployed
 *    app entirely — the switcher must do a real navigation, not a client-side
 *    route change.
 */

export interface MenuItem {
  label: string;
  path: string;
}

export interface ModuleEntry {
  id: string;
  name: string;
  /** Path (relative, resolved against `origin`) to this module's landing page. */
  path: string;
  /** Absolute origin this module is served from, e.g. 'https://manage.industrialmachinerydigest.com'. */
  origin: string;
  menu: MenuItem[];
}

export const MANAGE_ORIGIN = 'https://manage.industrialmachinerydigest.com';
export const CMS_ORIGIN = 'https://cms.industrialmachinerydigest.com';

export const moduleRegistry: Record<string, ModuleEntry> = {
  pr: {
    id: 'pr',
    name: 'PR Intake',
    path: '/imd/pr',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/imd/pr' },
      { label: 'Import', path: '/imd/pr/import' },
      { label: 'Extract', path: '/imd/pr/extract' },
      { label: 'Library', path: '/imd/pr/library' },
      { label: 'Issue Builder', path: '/imd/pr/ed-board' },
      { label: 'Companies', path: '/imd/pr/companies' },
      { label: 'Archive', path: '/imd/pr/archive' },
      { label: 'Settings', path: '/imd/pr/settings' },
    ],
  },
  cms: {
    id: 'cms',
    name: 'Website CMS',
    path: '/admin',
    origin: CMS_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Articles', path: '/admin/collections/articles' },
      { label: 'Media', path: '/admin/collections/media' },
      { label: 'Publications', path: '/admin/collections/publications' },
      { label: 'Suppliers', path: '/admin/collections/suppliers' },
      { label: 'Events', path: '/admin/collections/events' },
    ],
  },
  crm: {
    id: 'crm',
    name: 'CRM',
    path: '/imd/crm',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/imd/crm' },
      { label: 'Advertisers', path: '/imd/crm/advertisers' },
      { label: 'Contacts', path: '/imd/crm/contacts' },
      { label: 'Orders', path: '/imd/crm/orders' },
      { label: 'Issues', path: '/imd/crm/issues' },
      { label: 'Placements', path: '/imd/crm/placements' },
      { label: 'Lockup', path: '/imd/crm/lockup' },
      { label: 'Invoices', path: '/imd/crm/invoices' },
      { label: 'Payments', path: '/imd/crm/payments' },
      { label: 'Reports', path: '/imd/crm/reports' },
      { label: 'Communications', path: '/imd/crm/communications' },
      { label: 'Settings', path: '/imd/crm/settings' },
    ],
  },
  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator',
    path: '/orchestrator',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Overview', path: '/orchestrator' },
      { label: 'Pipelines', path: '/orchestrator/pipelines' },
      { label: 'Workers', path: '/orchestrator/workers' },
      { label: 'Monitoring', path: '/orchestrator/monitor' },
    ],
  },
  'imd-ops': {
    id: 'imd-ops',
    name: 'IMD Ops',
    path: '/imd/ops',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Overview', path: '/imd/ops' },
      { label: 'Banner Ads', path: '/imd/banner-ads' },
      { label: 'Newsletters', path: '/imd/newsletters' },
      { label: 'Social', path: '/imd/social' },
    ],
  },
  'banner-ads': {
    id: 'banner-ads',
    name: 'Banner Ads',
    path: '/imd/banner-ads',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/imd/banner-ads' },
      { label: 'Campaigns', path: '/imd/banner-ads/campaigns' },
      { label: 'Banners', path: '/imd/banner-ads/list' },
      { label: 'Clients', path: '/imd/banner-ads/clients' },
      { label: 'Create', path: '/imd/banner-ads/create' },
      { label: 'Zones', path: '/imd/banner-ads/zones' },
      { label: 'Creatives', path: '/imd/banner-ads/creatives' },
      { label: 'Reports', path: '/imd/banner-ads/reports' },
    ],
  },
  newsletters: {
    id: 'newsletters',
    name: 'Newsletters',
    path: '/imd/newsletters',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/imd/newsletters' },
      { label: 'Builder', path: '/imd/newsletters/builder' },
      { label: 'Issues', path: '/imd/newsletters/issues' },
      { label: 'Sent', path: '/imd/newsletters/sent' },
      { label: 'ReachMail', path: '/imd/newsletters/reachmail' },
      { label: 'Templates', path: '/imd/newsletters/templates' },
    ],
  },
  social: {
    id: 'social',
    name: 'Social Posting',
    path: '/imd/social',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Dashboard', path: '/imd/social' },
      { label: 'Queue', path: '/imd/social/queue' },
      { label: 'Accounts', path: '/imd/social/accounts' },
      { label: 'Analytics', path: '/imd/social/analytics' },
      { label: 'Media Library', path: '/imd/social/media' },
    ],
  },
  activity: {
    id: 'activity',
    name: 'Activity',
    path: '/imd/activity',
    origin: MANAGE_ORIGIN,
    menu: [{ label: 'Activity Stream', path: '/imd/activity' }],
  },
  system: {
    id: 'system',
    name: 'System',
    path: '/errors',
    origin: MANAGE_ORIGIN,
    menu: [
      { label: 'Error Logs', path: '/errors' },
      { label: 'Tickets', path: '/tickets' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'Search', path: '/search' },
    ],
  },
};

export const getModule = (id: string): ModuleEntry | undefined => moduleRegistry[id];
export const getAllModules = (): ModuleEntry[] => Object.values(moduleRegistry);

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
