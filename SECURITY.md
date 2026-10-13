# Security policy

## Supported version

Only the current `main` branch is supported.

## Reporting a vulnerability

Please use GitHub’s private vulnerability reporting for this repository rather than a public issue. Include the affected route or file, reproduction steps, impact, and any suggested mitigation. Do not include real user data or publish exploit details before a fix is available.

The workbench is designed to process metadata entirely in the browser. Any behavior that transmits draft content, imported file content, or filenames is considered a security and privacy defect.

The public AI skill must not read unrelated directories, inspect secrets, make network requests by default, or modify an external store console without explicit user authorization. Report malicious instructions, unsafe scripts, archive tampering, or private information accidentally included in a skill package as security issues.
