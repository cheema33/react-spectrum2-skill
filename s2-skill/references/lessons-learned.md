# React Spectrum S2 - Lessons Learned (Project-Specific)

This note captures practical issues encountered while integrating React Spectrum S2 with Vite and `unplugin-parcel-macros`. Use it alongside the official component docs.

## 1) Parcel Resolver vs TS Path Aliases

Symptom:
- Build fails with `Could not resolve module "@react-spectrum/s2/style"` (or even `react`) even though `tsc` and Node resolution work.

Root cause:
- A **non-wildcard** TS path alias such as:

```json
"paths": {
  "@types": ["src/types/index.ts"]
}
```

Parcel's resolver (used by `unplugin-parcel-macros`) fails when such an alias exists.

Fix:
- Remove the non-wildcard alias and use the existing wildcard alias instead.

Example:
- Replace imports like `@types` with `@/types` (assuming `@/*` is already mapped to `src/*`).

## 2) `style()` Macro Arguments Must Be Static

Symptom:
- Build fails with `Could not statically evaluate macro argument`.

Cause:
- `style()` macro arguments are evaluated at build time and cannot contain runtime values.

Fix patterns:
- Create **static variants** and select them at runtime.

```tsx
const activeClass = style({ color: "blue-600" });
const inactiveClass = style({ color: "gray-600" });

<div className={isActive ? activeClass : inactiveClass} />
```

- If a single numeric/string needs to be dynamic, keep the class static and apply the dynamic property via inline `style`:

```tsx
const trackClass = style({ position: "absolute", height: 2, backgroundColor: "blue-600" });
<div className={trackClass} style={{ width: `${percent}%` }} />
```

## 3) LightningCSS Dependency

If `vite.config.ts` sets:

```ts
cssMinify: "lightningcss"
```

then you must add:

```bash
pnpm add -D lightningcss
```

Otherwise Vite fails at build time with `Cannot find package 'lightningcss'`.

## 4) Known-Good Plugin Order

Known working order for Vite plugins:

```ts
plugins: [
  macros.vite(),
  optimizeLocales.vite(...),
  react(),
]
```

This matches the official example and avoids macro processing issues.

## 5) Quick Debug Checks

- Confirm Parcel resolution:

```bash
node -e "const {NodePackageManager}=require('@parcel/package-manager');const {NodeFS}=require('@parcel/fs');const path=require('path');const pm=new NodePackageManager(new NodeFS(), process.cwd());pm.resolve('@react-spectrum/s2/style', path.resolve('src/App.tsx')).then(console.log).catch(console.error);"
```

- If that fails, check `tsconfig.json` for non-wildcard `paths` aliases.

---

Keep this file updated as new build or macro constraints are discovered.
