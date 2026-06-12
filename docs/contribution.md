---
sidebar_position: 10
---

# Contribution Guidelines

Thank you for your interest in contributing to **Project Vigilion by CSE - Cyber at UoM**! We welcome contributions from the community to help improve the platform.

## Getting Started

1.  **Fork the Repository**: Start by forking the [Deployment-Repo](https://github.com/Cyber-Suite-CSE/Deployment-Repo) and other relevant services.
2.  **Clone Locally**: Clone your fork to your local machine.
3.  **Set Up Environment**: Follow the [Deployment Guide](/infrastructure/deployment) to set up the Dockerized environment.

## Development Workflow

1.  **Create a Branch**: Create a new branch locally dedicated to your feature or bugfix (e.g., `feature/my-new-feature`). This keeps your changes isolated from the main branch.
2.  **Make Changes**: Implement your changes, ensuring you follow the coding standards (see below).
3.  **Test**: Verify your changes locally. 
    *   For frontend changes, run the linter script and check visual styling.
    *   For backend services, invoke local unit testing scripts (such as `pytest` or package test suites) if configured.
4.  **Commit**: Commit your changes to your local branch using structured, descriptive commit messages (e.g., following Conventional Commits format, like `feat: Add new scanner module`).
5.  **Push**: Push the local branch containing your commits to your remote GitHub fork.
6.  **Pull Request**: Navigate to the original repository on GitHub and open a Pull Request (PR) against the target branch (e.g., `main`).

## Coding Standards

### Frontend (Dashboard)
*   **Framework**: Next.js 15 (App Router).
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS.
*   **Linting**: ESLint and Prettier are configured. Ensure no linting errors before committing.

### Backend Services
*   **Python**: Follow PEP 8 style guide. Use type hints (`typing` module) where possible.
*   **Node.js**: Use TypeScript and follow standard ESLint rules.

## Reporting Issues

If you find a bug or have a feature request, please open an issue in the appropriate repository using the provided issue templates.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Contributors

import Contributors from '@site/src/components/Contributors';

<Contributors />
