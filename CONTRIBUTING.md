# Contributing to NovaDock

Thank you for helping improve NovaDock. We welcome contributions that strengthen reliability, clarity, and the developer experience.

## Before you start

- Read the [documentation](docs/README.md) to understand platform boundaries.
- Check [open issues](https://github.com/shivamongit/new/issues) and existing pull requests.
- For large changes, open an issue first to align on scope.

## Development setup

```bash
cd novadock
pnpm install
pnpm db:push
pnpm dev
```

Run tests before submitting:

```bash
pnpm test
pnpm build
pnpm lint
```

## Pull request guidelines

- Use clear, descriptive titles and explain **why** the change matters.
- Keep diffs focused; separate refactors from feature work when possible.
- Update documentation when behavior or configuration changes.
- Do not invent product capabilities in docs or UI copy—mark planned work under Roadmap.

## Code style

- Match existing TypeScript, React, and Tailwind conventions in `novadock/`.
- Prefer product-oriented language in user-facing strings (see README guidelines).
- Internal implementation names may differ; user-visible text should stay consistent.

## Commit messages

Use complete sentences. Examples:

- `Fix health check retry when service starts slowly`
- `Document deployment API endpoints`

## Security

Report security concerns privately to the repository maintainers rather than opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
