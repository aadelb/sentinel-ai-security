# Contributing to Sentinel

Thank you for your interest in contributing to Sentinel! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sentinel.git
   cd sentinel
   ```
3. Add the upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/sentinel.git
   ```

## Development Setup

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Git

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # If available
   ```

3. Install development tools:
   ```bash
   pip install pytest pytest-cov ruff pre-commit
   ```

4. Set up pre-commit hooks (optional but recommended):
   ```bash
   pre-commit install
   ```

### Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_specific.py

# Run tests matching a pattern
pytest -k "test_pattern"
```

### Running Linting

```bash
# Check code style
ruff check .

# Check formatting
ruff format --check .

# Auto-fix issues
ruff check --fix .
ruff format .
```

## Code Style Guidelines

### Python Style

- Follow PEP 8 guidelines
- Use type hints for function parameters and return values
- Maximum line length: 88 characters (Black/Ruff default)
- Use meaningful variable and function names

### Example

```python
from typing import Optional

def process_data(input_data: dict, timeout: Optional[int] = None) -> dict:
    """
    Process input data and return results.

    Args:
        input_data: The data to process.
        timeout: Optional timeout in seconds.

    Returns:
        Processed data as a dictionary.

    Raises:
        ValueError: If input_data is empty.
    """
    if not input_data:
        raise ValueError("Input data cannot be empty")

    # Processing logic here
    return {"status": "success", "data": input_data}
```

### Documentation

- Write docstrings for all public functions, classes, and modules
- Use Google-style docstrings
- Keep comments concise and meaningful
- Update README.md when adding new features

### Testing

- Write tests for all new functionality
- Maintain or improve code coverage
- Use descriptive test names
- Include both positive and negative test cases

## Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. Follow conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

4. Keep commits atomic and focused on a single change

## Pull Request Process

1. Update your branch with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request on GitHub:
   - Fill out the PR template completely
   - Link any related issues
   - Add appropriate labels

4. Address review feedback:
   - Make requested changes
   - Push additional commits
   - Re-request review when ready

5. Requirements for merging:
   - All CI checks must pass
   - At least one approval from a maintainer
   - No unresolved conversations
   - Branch is up to date with main

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment details (OS, Python version, etc.)
- Relevant logs or error messages

### Feature Requests

When requesting features, please include:

- A clear description of the feature
- The use case or problem it solves
- Any proposed implementation ideas
- Priority level from your perspective

## Questions?

If you have questions, feel free to:

- Open a GitHub Discussion
- Create an issue with the "question" label
- Reach out to the maintainers

Thank you for contributing!

---
Ahmed Adel Bakr Alderai
