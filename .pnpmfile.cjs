// Keep the unstable `@typescript/native-preview` (tsgo dev snapshot) out of the install.
//
// `rolldown-plugin-dts` (pulled in by `tsdown`) declares `@typescript/native-preview`
// as an OPTIONAL peer dependency. With pnpm's `auto-install-peers`, that would drag the
// preview back into the workspace transitively — even though nothing here uses it:
//   • .d.ts generation runs on the classic TypeScript 6 API (`typescript` is aliased to
//     `@typescript/typescript6`, which satisfies rolldown-plugin-dts's `typescript` peer);
//   • type-checking and the LSP run on TS 7's `tsc` (`@typescript/native`).
// Removing the optional peer from the manifest at resolution time stops the auto-install
// without affecting rolldown-plugin-dts, which simply falls back to the `typescript` peer.
function readPackage(pkg) {
  if (pkg.name === 'rolldown-plugin-dts') {
    if (pkg.peerDependencies) {
      delete pkg.peerDependencies['@typescript/native-preview'];
    }
    if (pkg.peerDependenciesMeta) {
      delete pkg.peerDependenciesMeta['@typescript/native-preview'];
    }
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
