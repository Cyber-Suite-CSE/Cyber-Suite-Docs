---
sidebar_position: 1
---

# Deployment Guide

## Overview

The **Deployment Repository** (`Deployment-Repo`) acts as the central orchestration hub for the Cyber Suite CSE platform. It contains the `docker-compose.yml` file necessary to spin up all microservices, networks, and volumes required for the system to function.

## Prerequisites

*   **Docker**: Ensure Docker Engine is installed and running.
*   **Docker Compose**: Required for multi-container orchestration.

## Repository Structure

*   `docker-compose.yml`: Main orchestration file defining services, networks, and volumes.
*   `nginx.conf`: Configuration for the Nginx reverse proxy.
*   `env/`: Directory containing environment variable files for each service.
    *   `dashboard/.env`
    *   `api-gateway/.env`
    *   `web-domain-scanner/.env`
    *   `db-security-scanner/.env`
    *   `api-tester/.env`
    *   `code-scanner-ai/.env`
    *   `misconfig-service/.env`

## Service Configuration

Each service is configured via its respective `.env` file in the `env/` directory.

### Key Environment Variables

*   **API Gateway**: `PORT`, `JWT_SECRET`, Service URLs (`API_TESTER_URL`, etc.).
*   **Dashboard**: `NEXT_PUBLIC_...` variables for connecting to the API Gateway.
*   **Web Domain Scanner**: Redis connection details.
*   **Misconfig Checker**: `GOOGLE_API_KEY` (if using Gemini), `MSF_PASSWORD` (for Metasploit).

## Deployment Steps

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd Deployment-Repo
    ```

2.  **Configure Environment**:
    Review and update the files in `env/` with your specific API keys and secrets.
    *   **Crucial**: Ensure `MSF_PASSWORD` is set in `env/misconfig-service/.env`.

3.  **Start Services**:
    Pull the latest images and start the stack in detached mode:
    ```bash
    docker-compose up -d
    ```

4.  **Verify Deployment**:
    Check the status of running containers:
    ```bash
    docker-compose ps
    ```
    All services (`cyber-suite-dashboard`, `cyber-suite-api-gateway`, etc.) should be in the `Up` state.

5.  **Access the Platform**:
    Open your web browser and navigate to:
    *   **Dashboard**: `https://localhost` (or `http://localhost`, redirects to HTTPS).
    *   **Metasploit RPC**: Internal Port `$\mu$`.
    *   **Redis**: Internal Port `$\rho$` (internal only).

## Troubleshooting

*   **Container Conflicts**: If internal ports (e.g., $\alpha$, $\beta$) are already in use, modify `docker-compose.yml` or stop conflicting services.
*   **Environment Variables**: If a service fails to start or connect, double-check its `.env` file for typos or missing required variables.
*   **Logs**: View logs for a specific service using:
    ```bash
    docker-compose logs -f <service-name>
    ```
    Example: `docker-compose logs -f api-gateway`
