export type CapabilityStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
export type CapabilityExecutionMode = 'LOCAL' | 'REMOTE' | 'HYBRID';
/** A deliberately simple schema description; providers may link richer schemas separately. */
export interface CapabilityDataContract {
    name: string;
    description: string;
    requiredFields: string[];
    optionalFields?: string[];
}
export interface CapabilityOperation {
    key: string;
    displayName: string;
    description: string;
    input: CapabilityDataContract;
    output: CapabilityDataContract;
    idempotent: boolean;
}
/** Provider declaration consumed by SEMA Core discovery/resolution. */
export interface CapabilityManifest {
    capabilityKey: string;
    displayName: string;
    description: string;
    providerKey: string;
    version: string;
    status: CapabilityStatus;
    executionModes: CapabilityExecutionMode[];
    operations: CapabilityOperation[];
    documentation: {
        summary: string;
        useCases: string[];
        limitations: string[];
        changeNotes: string[];
    };
}
//# sourceMappingURL=types.d.ts.map