# Agent Guidelines for Todo.Txt Repository

## Build, Lint, and Test Commands

### Development
```bash
# Start development server
bun run dev

# Preview production build locally
bun run preview
```

### Building
```bash
# Build for production
bun run build
```

### Linting and Formatting
```bash
# Run Biome linter and formatter with fixes
bun run lint

# Equivalent to:
# biome check --write . && tsc
```

### Type Checking
```bash
# Run TypeScript compiler
npx tsc --noEmit
```

