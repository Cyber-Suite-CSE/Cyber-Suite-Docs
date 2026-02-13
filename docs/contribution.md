---
sidebar_position: 10
---

# Contribution Guidelines

Thank you for your interest in contributing to **Cyber Suite CSE**! We welcome contributions from the community to help improve the platform.

## Getting Started

1.  **Fork the Repository**: Start by forking the [Deployment-Repo](https://github.com/Cyber-Suite-CSE/Deployment-Repo) and other relevant services.
2.  **Clone Locally**: Clone your fork to your local machine.
3.  **Set Up Environment**: Follow the [Deployment Guide](/infrastructure/deployment) to set up the Dockerized environment.

## Development Workflow

1.  **Create a Branch**: Create a new branch for your feature or bugfix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Make Changes**: Implement your changes, ensuring you follow the coding standards (see below).
3.  **Test**: Verified your changes locally.
    *   For frontend changes: `npm run lint` and verify UI responsiveness.
    *   For backend services: Run unit tests (e.g., `pytest`, `npm test`) if available.
4.  **Commit**: Commit your changes with clear, descriptive messages.
    ```bash
    git commit -m "feat: Add new scanner module"
    ```
5.  **Push**: Push your branch to your fork.
    ```bash
    git push origin feature/my-new-feature
    ```
6.  **Pull Request**: Open a Pull Request (PR) against the `main` branch of the original repository.

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
