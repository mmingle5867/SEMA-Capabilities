import type { CapabilityManifest } from './types.js';
/** Validates provider declarations before they enter discovery. */
export declare function defineCapability(manifest: CapabilityManifest): Readonly<CapabilityManifest>;
/** Returns documentation suitable for help panels and SeloDoc collection. */
export declare function describeCapability(manifest: CapabilityManifest): {
    capabilityKey: string;
    providerKey: string;
    version: string;
    summary: string;
    operations: {
        key: string;
        displayName: string;
        description: string;
        input: import("./types.js").CapabilityDataContract;
        output: import("./types.js").CapabilityDataContract;
        idempotent: boolean;
    }[];
    useCases: string[];
    limitations: string[];
    changeNotes: string[];
};
//# sourceMappingURL=manifest.d.ts.map