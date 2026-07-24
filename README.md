# @imd/shared-chrome

The single shared header/module-switcher for every IMD internal app (manage, CMS, and
future internal tools). Previously the CMS hand-copied a duplicate of manage's header and
module list, which drifted out of sync. This package is the one source of truth.

## What it is

- `moduleRegistry` — every module, its landing page, and which app (origin) it lives on.
- `<Chrome />` — the header itself: brand, module switcher, user menu. Framework-agnostic —
  it doesn't assume React Router or Next.js routing. Pass `renderLink` if a host app wants
  same-origin module links to use its own client-side router; otherwise links are plain
  `<a href>` (correct default for cross-app navigation, which is most of them).
- Auth is NOT this package's concern. The host app resolves the logged-in user however it
  authenticates (shared cookie, local API, whatever) and passes it in as `user` /
  `onLogout`. `<Chrome />` only renders what it's given.

## Install (from a consumer repo)

```bash
npm install "github:sbell-coder/imd-shared-chrome#main"
```

Pin to a commit/tag once this stabilizes rather than tracking `main` forever.

## Usage

```tsx
import { Chrome } from '@imd/shared-chrome';

<Chrome
  currentModuleId="pr"
  user={user ? { name: user.name, email: user.email, avatarUrl: user.avatar } : user}
  onLogout={logout}
  accountHref="/user-settings"
  renderLink={({ href, children, className }) => <Link to={href} className={className}>{children}</Link>}
/>
```

`user` semantics: `undefined` while auth is still resolving (renders no user-menu slot),
`null` once resolved-but-logged-out, a `ChromeUser` object once logged in.

## Development

```bash
npm install
npm run typecheck
npm run build   # emits dist/ — also runs automatically on `npm install` in a consumer (prepare script)
```
