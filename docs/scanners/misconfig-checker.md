---
sidebar_position: 4
---

# Deployment Misconfig Checker

## Overview

The **Deployment Misconfig Checker** is an advanced, agent-based security tool designed to identify infrastructure misconfigurations and vulnerabilities. It leverages a suite of industry-standard tools—**Nmap**, **Nikto**, **WPScan**, and **Metasploit**—orchestrated by an AI agent to perform intelligent reconnaissance and exploitation capable scanning.

## Architecture

The system uses a hierarchical multi-agent architecture built with **LangChain** and **Google Gemini**:

1.  **Orchestrator Agent**: The central brain that analyzes user requests and routes them to the appropriate specialist agent.
2.  **Specialist Agents**:
    *   **Nmap Agent**: Handles network discovery, port scanning, and OS detection.
    *   **Nikto Agent**: Specialized in web server vulnerability scanning and CGI detection.
    *   **WPScan Agent**: Dedicated to identifying WordPress vulnerabilities, plugins, and themes.
    *   **Metasploit Agent**: Interfaces with the Metasploit RPC service to verify exploitability of found vulnerabilities.

## key Features

*   **Natural Language Interface**: Users can request scans using plain English (e.g., "Scan localhost for open ports").
*   **Intelligent Routing**: The system automatically selects the best tool for the job based on the request.
*   **Safety Checks**: Built-in safeguards preventing unauthorized or dangerous commands.
*   **Real Integration**: Executes actual security tools, not simulations.

## Configuration

**Environment Variables:**
*   `GOOGLE_API_KEY`: API key for the Gemini LLM.
*   `MSF_PASSWORD`: Password for authenticating with the Metasploit RPC service.
*   `PORT`: Service listening port (Default: $\delta$).

## Dependencies

*   **Metasploit Framework**: Runs as a separate container (`metasploit`) listening on internal port $\mu$.
*   **Python 3.11**: Runtime environment.
*   **LangChain**: Framework for building the agent logic.

## Usage

The service is accessed via the Dashboard's **Misconfig Checker** interface. Users enter natural language commands, which are processed by the backend agent to execute the appropriate security scans.
