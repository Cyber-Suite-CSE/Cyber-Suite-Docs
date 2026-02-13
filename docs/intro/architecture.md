---
sidebar_position: 2
---

# System Architecture

## Overview

The **Cyber Suite CSE** platform is a comprehensive cybersecurity auditing and monitoring system composed of multiple specialized microservices. The architecture follows a microservices pattern, orchestrated via Docker Compose, with a central Dashboard and API Gateway for unified access and control.

## High-Level Architecture

```mermaid
graph TD
    User[User / Browser] -->|HTTPS 443| Nginx[Nginx Reverse Proxy]
    Nginx -->|/| Dashboard[Cyber Suite Dashboard<br/>Next.js]
    Nginx -->|/api/| APIGateway[API Gateway<br/>Node.js/Express]
    
    Dashboard -->|Internal API Calls| APIGateway
    
    subgraph "Backend Services"
        APIGateway -->|Proxies Requests| WR[Web Routing Layer]
        
        WR -->|/api/gateway/web-scanner/*| WebScanner[Web Domain Scanner<br/>FastAPI :8001]
        WR -->|/api/gateway/database-scanner/*| DBScanner[Database Security Scanner<br/>FastAPI :8002]
        WR -->|/api/gateway/misconfig-checker/*| Misconfig[Misconfig Checker<br/>Python/LangChain :8003]
        WR -->|/api/gateway/api-tester/*| APITester[API Tester<br/>FastAPI :8004]
        WR -->|/api/gateway/code-scanner/*| CodeScanner[Code Scanner AI<br/>Node.js :8005]
    end
    
    subgraph "Infrastructure & Databases"
        WebScanner --> Redis[Redis Message Broker]
        Misconfig --> Metasploit[Metasploit Framework<br/>:55553]
    end
    
    subgraph "Web Scanner Workers"
        Redis --> WorkerEnum[Domain Enum Worker]
        Redis --> WorkerService[Service Disc Worker]
        Redis --> WorkerAnalysis[Web Analysis Worker]
    end
```

## Service Communication Flow

1.  **Ingress**: All external traffic enters through the **Nginx** reverse proxy on ports 80 (redirects to 443) and 443 (SSL).
2.  **Frontend Serving**: Nginx routes standard web requests (`/`, `/_next`) to the **Cyber Suite Dashboard** container.
3.  **API Routing**: Requests destined for backend services (`/api/...`) are routed to the **Cyber Suite API Gateway**.
4.  **Service Orchestration**: The API Gateway validates authentication tokens (JWT) and routes the request to the appropriate internal microservice (e.g., `web-domain-scanner-api`, `db-security-scanner`).
5.  **Inter-Service Communication**: Services communicate over a dedicated Docker bridge network (`cyber-net`).


## Request Lifecycle (Deep Dive)

The following sequence diagram illustrates the exact flow of a request from the user's browser to a backend service (e.g., Web Domain Scanner).

```mermaid
sequenceDiagram
    participant User as Browser / User
    participant Nginx as Nginx Proxy
    participant Gateway as API Gateway (:3000)
    participant Auth as Auth Middleware
    participant Router as Proxy Router
    participant Service as Backend Service (e.g., Web Scanner)

    %% Authentication Phase
    Note over User, Gateway: 1. Authentication
    User->>Nginx: POST /api/auth/login (Creds)
    Nginx->>Gateway: Forward Request
    Gateway->>Gateway: Validate Admin Credentials
    Gateway-->>User: Set-Cookie: auth_token=JWT (HttpOnly)

    %% Service Request Phase
    Note over User, Service: 2. Protected Service Access
    User->>Nginx: GET /api/gateway/web-scanner/jobs/123
    Nginx->>Gateway: Forward Request (with Cookie)
    
    Gateway->>Auth: authMiddleware()
    Auth->>Auth: Verify JWT in Cookie
    
    alt Invalid Token
        Auth-->>User: 401 Unauthorized
    else Valid Token
        Auth->>Router: Next()
        
        Note right of Router: Dynamic Routing Logic
        Router->>Router: Extract Service: "web-scanner"
        Router->>Router: Lookup Target: "http://web-scanner-api:8001"
        Router->>Router: Rewrite Path: "/jobs/123"
        
        Router->>Service: GET /jobs/123
        Service-->>Router: JSON Response
        Router-->>User: JSON Response
    end
```

## Network Topology & Isolation


| Service | Container Name | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `cyber-suite-dashboard` | 3000 | Frontend UI (Next.js) and BFF (Backend for Frontend). |
| **API Gateway** | `cyber-suite-api-gateway` | 3000 | Central authentication and routing hub. |
| **Web Domain Scanner** | `web-domain-scanner-api` | 8001 | Distributed scanning system for web assets. |
| **DB Scanner** | `db-security-scanner` | 8002 | Scans databases (Postgres, MySQL) for misconfigurations. |
| **Misconfig Checker** | `deployment-misconfig-checker` | 8003 | AI-driven agent (Nikto, Nmap, WPScan, MSF) for vulnerability detection. |
| **API Tester** | `api-tester` | 8004 | Tool for defining and running API security tests. |
| **Code Scanner AI** | `code-scanner-ai` | 8005 | AI-powered static application security testing (SAST). |
| **Metasploit** | `metasploit` | 55553 | RPC service for exploitation tasks used by Misconfig Checker. |
| **Redis** | `web-scanner-redis` | 6379 | Message broker for the Web Domain Scanner's async workers. |

## Network Topology

All services are connected to the `cyber-net` bridge network, ensuring they can resolve each other by container name while remaining isolated from the host's external network, except for explicitly exposed ports (managed by `docker-compose.yml`).

```mermaid
graph LR
    subgraph "Docker Network: cyber-net"
        gateway(API Gateway)
        dashboard(Dashboard)
        
        subgraph "Scanning Tools"
            web(Web Scanner)
            db(DB Scanner)
            misconfig(Misconfig Checker)
            api(API Tester)
            code(Code Scanner)
        end
        
        gateway --- web
        gateway --- db
        gateway --- misconfig
        gateway --- api
        gateway --- code
        
        dashboard -.-> gateway
    end
```
