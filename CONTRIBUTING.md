# Contributing to React Spectrum S2 Skill

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Ways to Contribute

### Reporting Issues

- **Bug reports**: If you find a bug in the generator script or documentation, please open an issue with:
  - A clear description of the problem
  - Steps to reproduce
  - Expected vs actual behavior
  - Your Node.js version

- **Documentation improvements**: If you find unclear or incorrect documentation, please open an issue or submit a PR.

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test your changes (run the generator script if applicable)
5. Commit with a clear message
6. Push to your fork
7. Open a Pull Request

### Code Style

- Use ES modules (`.mjs` extension)
- No external dependencies for the generator script
- Clear, descriptive variable names
- Include comments for complex logic

## Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/react-spectrum2-skill.git
cd react-spectrum2-skill

# The generator script requires:
# - Node.js 18.0+
# - Access to a React Spectrum repository with yarn installed
```

## Regenerating Documentation

If React Spectrum S2 has been updated and you want to regenerate the skill files:

```bash
# Point to your local React Spectrum repo
node generate-s2-skill.mjs /path/to/react-spectrum
```

## Questions?

If you have questions, feel free to open an issue for discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
