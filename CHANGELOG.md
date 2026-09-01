# Changelog

## 2.0.0

### Fixed

- Requests now settle on HTTP errors, network errors, timeouts, cancellation, and empty batches.
- All non-2xx HTTP responses are reported as failures.
- `stepped: false`, duplicate URLs, and requests cancelled before progress now work correctly.
- Progress is monotonic and naturally completed batches finish at 100%.

### Added

- Added request timeouts, normalized failure metadata, TypeScript declarations, package exports, and `dispose()` for object-URL cleanup.
- Added an optional `concurrency` limit while preserving unlimited parallel requests by default.
- Added deterministic browser tests and continuous integration.

### Changed

- `state` now contains only the latest batch.
- Overlapping `fetch()` calls on one instance reject with a usage error.
- The build and development dependencies have been replaced with maintained versions.
