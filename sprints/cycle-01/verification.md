# Local verification — October 1, 2026

- Node.js: 22.15.0; npm: 11.3.0.
- `npm run build`: passed; homepage and login prerendered, role preview built as a dynamic route.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Dependency installation audit: zero reported vulnerabilities.
- Production server HTTP checks: passed for `/`, `/login`, all five role preview URLs, and the invalid-role fallback. Each returned HTTP 200 and expected screen content.

Browser visual inspection, client interaction testing, screenshots, and individual teammate run verification are still pending. Local HTTP checks verify rendered page content, not the interactive sign-in form or responsive appearance.

## Dependency reproducibility

Dependencies are pinned and `package-lock.json` is committed with the source changes for `npm ci`. The `baseline-browser-mapping` override selects patched version 2.11.0 because the registry's latest advertised 2.11.27 tarball returned 404 during setup. Revisit this override during a future dependency update once the registry issue is resolved.
