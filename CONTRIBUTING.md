# Contributing

Contributions and bug reports are welcome.

## Development

Use Node.js 22 or 24 and install dependencies from the lockfile:

```sh
npm ci
```

Install the Playwright browsers once, then run the complete suite:

```sh
npx playwright install chromium firefox webkit
npm test
```

Before opening a pull request, also verify the dependency audit and published contents:

```sh
npm audit --audit-level=high
npm run pack:check
```
