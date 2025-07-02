# Website

This `docs` folder contains the source for the public documentation site at [https://atomic-testing.dev](https://atomic-testing.dev). It is built with [Docusaurus 2](https://docusaurus.io/).

The rest of the repository holds the Atomic Testing packages. See the root [README](../README.md) for package details.

### Installation

```
$ pnpm install .
```

Note that the documentation is within a monorepo, thus `pnpm install` without `.` would install dependencies for packages within monorepo

### Local Development

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
After running `pnpm build` the generated files live in `docs/build`. Deploying to GitHub Pages will publish them to `https://atomic-testing.dev`.

### Deployment

Using SSH:

```
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
