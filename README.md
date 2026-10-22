# SEMA Capability Contracts

Portable provider manifests with operation and documentation contracts. See `docs/CAPABILITY_SCOPE.md`.

## Definitions

`definitions/<capability key>/<version>.json` is the contract of one published capability version (D-152, D-156): its key, version, name, description and operations, each saying whether every service must provide it, with its input and output as JSON Schema (D-155). A published file is never changed; a changed contract is a new file. Core is given these files to publish a capability version (`POST /v1/core/capabilities/versions`). `npm test` checks every file.

## Write listing copy (0.2.0)

`definitions/sema.listing.write-copy/1.0.0.json` is the first real capability (D-136 to D-142): one operation, `generate`, taking the item's facts, optional photos by reference, the platform's rules as data, a style and how many variants; giving variants with a rule check each. `src/listing-copy.ts` is the rule check itself (`checkListingCopy`), plain code every service and application uses the same way.
