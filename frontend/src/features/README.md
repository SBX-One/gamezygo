# Features Folder

This directory contains domain-based modules as required by the Gamezygo Frontend Architecture and Coding Standards (domain-driven Features Architecture).

## Cohesive Feature Structure
Each folder in this directory represents a domain-based feature (e.g., `auth`, `catalog`, `checkout`, `library`) and should contain:
- `components/` - Feature-specific components
- `hooks/` - Feature-specific TanStack Query hooks
- `services/` - Feature-specific API clients
- `store/` - Feature-specific Zustand stores
- `types.ts` - Feature-specific Type definitions
- `utils.ts` - Feature-specific pure helper functions
