# Specification

## Summary
**Goal:** Fix the current build/deployment failure and successfully rebuild and redeploy the app without breaking the existing notebook workflow.

**Planned changes:**
- Identify and resolve the root cause(s) of the current frontend and/or backend build errors.
- Fix any deployment-time issues (e.g., traps, canister install/upgrade errors) preventing a successful deploy.
- Validate post-deploy behavior to ensure the existing end-to-end notebook workflow continues to work (Internet Identity login, date selection, load/edit/save follower list).
- Ensure any newly introduced or modified user-facing UI text remains in English.

**User-visible outcome:** The app builds and deploys cleanly, and users can continue to log in with Internet Identity and use the existing notebook flow to load, edit, and save follower lists by date.
