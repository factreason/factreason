# Worked examples — dependency upgrade advisories

Two real responses from the live service. Both are reproducible today; both were
verified by hand against the publishers' own release notes before this file was
written.

---

## npm — `chalk` 4.1.2 → 5.0.0

The upgrade that breaks CommonJS codebases. Two breaking findings, neither of
them inferred.

```
GET https://factgrid.co.uk/api/v1/packages/npm/chalk/advisory?from=4.1.2&to=5.0.0
Authorization: Bearer <key>
```

| Severity | Change | Field | Before → After |
|---|---|---|---|
| breaking | `MODULE_FORMAT_CHANGED` | `type` | `undefined` → `"module"` |
| breaking | `RUNTIME_REQUIREMENT_RAISED` | `engines.node` | `">=10"` → `"^12.17.0 \|\| ^14.13 \|\| >=16.0.0"` |
| risky | `DEPENDENCY_REMOVED` | `dependencies.ansi-styles` | `"^4.1.0"` → removed |
| risky | `DEPENDENCY_REMOVED` | `dependencies.supports-color` | `"^7.1.0"` → removed |
| informational | `MAJOR_VERSION_BUMP` | `version` | `4.1.2` → `5.0.0` |

**Verified against the publisher:** chalk 5 is documented as a pure ESM package
requiring Node.js 12.17.0+. Both breaking findings match what the maintainer
says, and each one names the `package.json` field you can check yourself.

Note what is *not* claimed. The two removed dependencies are `risky`, not
`breaking` — code that imported them transitively will break, but the package's
own surface didn't remove them from callers. The major version bump is
`informational`: a version number is a signal, not evidence.

---

## PyPI — `urllib3`, yanked releases

PyPI lets a maintainer **yank** a release: it stays installable by exact pin but
is withdrawn from resolution. Package managers will still install a yanked
version if something pins it. This is the kind of thing an agent needs told.

```
GET https://factgrid.co.uk/api/v1/packages/pypi/urllib3/advisory?from=1.26.20&to=2.0.0
Authorization: Bearer <key>
```

```json
{
  "severity": "breaking",
  "changeType": "RELEASE_YANKED",
  "description": "urllib3 2.0.0 was yanked by the publisher: Truncated response bodies when streaming a large compressed body. Upgrade to at least 2.0.2 (See: https://github.com/urllib3/urllib3/issues/3009)",
  "evidenceField": "yanked",
  "evidenceBefore": "false",
  "evidenceAfter": "true",
  "migrationHint": "Do not install this version. Pin to the last non-yanked release."
}
```

The reason text is the publisher's own, reproduced verbatim — not a summary and
not a paraphrase.

---

## What the engine will and won't say

Across `urllib3`'s **103 consecutive stable releases**, the engine emits **7
advisories, 5 of them breaking**. Not hundreds. That restraint is deliberate:

| Severity | Reserved for |
|---|---|
| `breaking` | A removal or tightening **provable from declared metadata** — an entry point gone from an `exports` map, a raised runtime floor, a yanked release, a newly required peer dependency |
| `risky` | Publisher-declared warnings and changed obligations — a deprecation message, a licence change, a dropped dependency |
| `informational` | Additions and context. **An addition can never be breaking** — there is a test asserting it |

Where a version range cannot be parsed, the engine returns **nothing** rather
than guessing. An unverifiable claim is worse than no claim.

---

## Scope

These advisories are derived from publisher-declared registry metadata: the npm
packument and the PyPI JSON API. Nothing is scraped, no tarballs are downloaded,
and no behaviour is inferred by execution.

That means a maintainer who silently changes what a function *returns* without
touching `package.json` will not appear here. Read the changelog for that. The
boundary is stated because a tool that overstates its coverage is worse than one
that doesn't have it.
