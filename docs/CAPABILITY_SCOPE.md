# SEMA Capability Contracts scope

This package defines how a specialized provider declares what it can do, what each operation accepts and returns, where it can run, and how it documents limitations and changes.

It does not implement graphics, conversion, pricing, marketplace, authentication, or any other specialized behavior. Those implementations belong in separate provider packages that publish manifests through these contracts and are resolved through SEMA Core.

VectorForge graphics is the first intended consumer. VTracer, Sharp, and SVGO belong in a VectorForge graphics provider package, not here or in common facilities.
