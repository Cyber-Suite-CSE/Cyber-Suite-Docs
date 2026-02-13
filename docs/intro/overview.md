---
sidebar_position: 1
---

# Project Overview

**Cyber Suite CSE** is an advanced, integrated platform for cybersecurity auditing, vulnerability scanning, and compliance monitoring. It brings together multiple security tools into a unified dashboard, providing a centralized view of your security posture.

The project is designed with a microservices architecture, allowing each component (scanners, API testers, etc.) to operate independently and scale according to demand.

## Core Components

The suite consists of the following key modules:

1.  **[Cyber Suite Dashboard](/core/dashboard)**: The central command center. Provides a unified UI for managing scans, visualizing results, and configuring the system.
2.  **[Web Domain Scanner](/scanners/web-domain-scanner)**: A distributed scanning engine for discovering subdomains, open ports, and web vulnerabilities.
3.  **[Database Security Scanner](/scanners/database-scanner)**: Audits relational databases (PostgreSQL, MySQL) for misconfigurations and weak credentials.
4.  **[API Tester](/core/api-gateway)**: A dedicated tool for defining and running security tests against API endpoints.
5.  **[Code Scanner AI](/scanners/code-scanner)**: An AI-powered static analysis tool that detects vulnerabilities in source code.
6.  **[Deployment Misconfig Checker](/scanners/misconfig-checker)**: An intelligent agent that utilizes tools like Nmap, Nikto, and Metasploit to find infrastructure misconfigurations.
7.  **[System Architecture](/intro/architecture)**: Detailed diagrams and explanations of the system's design and communication flow.

## Getting Started

To get the system up and running, please refer to the **[Deployment Guide](/infrastructure/deployment)**. This guide covers prerequisites, environment configuration, and Docker Compose commands to launch the entire stack.

## Architecture Overview

The system relies on a **Docker Compose** orchestration layer that manages the lifecycle of all services.

*   **Frontend**: Next.js Dashboard served via Nginx.
*   **Gateway**: Node.js/Express API Gateway managing traffic to backend services.
*   **Backend**: A mix of Python (FastAPI, LangChain) and Node.js microservices.
*   **Infrastructure**: Redis for message queuing and PostgreSQL/MySQL for data persistence (where applicable).

For a deep dive into the technical architecture, see **[System Architecture](/intro/architecture)**.
