---
sidebar_position: 2
---

# Database Security Scanner

## Overview

The **Database Security Scanner** is a specialized tool for auditing the security configuration and access controls of relational databases. It supports **PostgreSQL** and **MySQL**, providing deep insights into potential misconfigurations and weak credentials.

## Capabilities

*   **Configuration Auditing**: Checks database settings (logging, connection limits, version, encryption) against industry best practices.
*   **Password Strength Testing**: Identifies weak, default, or easily guessable passwords using dictionary and regex-based checks.
*   **Vulnerability Detection**: Checks for known vulnerabilities associated with the specific database version.
*   **Real-time Reporting**: Streams scan progress and results via WebSockets.
*   **Lightweight & Fast**: Optimized architecture removing heavy NLP/AI dependencies

## Technology Stack

*   **Core**: Python (FastAPI) - Running on Alpine Linux
*   **Server**: Uvicorn
*   **Communication**: REST API (Control) & WebSockets (Data Streaming)
*   **Dependencies**: SQLAlchemy, AsyncPG, Paramiko (for SSH)

## Architecture

The scanner operates as a standalone microservice exposing an API on internal port **$\gamma$**.

*   **REST API**: Used to initiate scans and retrieve static configuration data.
*   **WebSockets**: Used to push live updates during long-running scans (e.g., password auditing).

## Configuration

**Environment Variables:**
*   `PORT`: Service listening port (Default: $\gamma$).
*   `CREDENTIALS_JSON_PATH`: Path to the dictionary file used for password auditing.
*   `ENGINES_JSON_PATH`: Configuration file defining supported database engines and their specific checks.

## Usage

1.  Navigate to the **Database Scanner** in the Dashboard.
2.  Enter the target database connection details (Host, Port, User, Database Name).
3.  Select the scan type (Configuration, Password, or Full).
4.  Start the scan and view real-time results in the console output.
