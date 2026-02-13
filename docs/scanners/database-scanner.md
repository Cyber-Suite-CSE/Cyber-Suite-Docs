---
sidebar_position: 2
---

# Database Security Scanner

## Overview

The **Database Security Scanner** is a specialized tool for auditing the security configuration and access controls of relational databases. It supports **PostgreSQL** and **MySQL**, providing deep insights into potential misconfigurations and weak credentials.

## Capabilities

*   **Configuration Auditing**: Checks database settings (logging, connection limits, version, encryption) against industry best practices.
*   **Password Strength Testing**: Identifies weak, default, or easily guessable passwords for database users.
*   **Vulnerability Detection**: Checks for known vulnerabilities associated with the specific database version.
*   **Real-time Reporting**: Streams scan progress and results via WebSockets.

## Technology Stack

*   **Core**: Python (FastAPI)
*   **Server**: Uvicorn
*   **Communication**: REST API (Control) & WebSockets (Data Streaming)

## Architecture

The scanner operates as a standalone microservice exposing an API on port **8002**.

*   **REST API**: Used to initiate scans and retrieve static configuration data.
*   **WebSockets**: Used to push live updates during long-running scans (e.g., password auditing).

## Configuration

**Environment Variables:**
*   `PORT`: Service listening port (Default: 8002).
*   `CREDENTIALS_JSON_PATH`: Path to the dictionary file used for password auditing.
*   `ENGINES_JSON_PATH`: Configuration file defining supported database engines and their specific checks.

## Usage

1.  Navigate to the **Database Scanner** in the Dashboard.
2.  Enter the target database connection details (Host, Port, User, Database Name).
3.  Select the scan type (Configuration, Password, or Full).
4.  Start the scan and view real-time results in the console output.
