---
sidebar_position: 1
---

# Deployment Guide

## Overview

The **Deployment Repository** (`Deployment-Repo`) acts as the central orchestration hub for the Cyber Suite CSE platform. It uses **Kubernetes with Kustomize overlays** to manage environment-specific configurations for development and production deployments.

## Prerequisites

- **Kubernetes Cluster**: Running cluster (Docker Desktop, Minikube, K3s, EKS, GKE, etc.)
- **kubectl**: Kubernetes command-line tool
- **Kustomize**: Built into kubectl (v1.14+)
- **Minimum Resources**:
  - **RAM**: 8 GB (16 GB recommended for production)
  - **Storage**: 30 GB minimum (50 GB recommended)
  - **CPU**: 4 cores (8 cores recommended)

## Repository Structure

```
Deployment-Repo/
├── k8s/
│   ├── .config.env              # Configuration template
│   ├── .secrets.env             # Secrets template
│   ├── base/                    # Core application manifests
│   │   ├── kustomization.yaml
│   │   ├── 00-namespace.yaml
│   │   ├── 02-configmaps.yaml
│   │   ├── 03-pvc.yaml
│   │   ├── *.yaml              # Service deployments
│   │   └── replacements.yaml
│   └── overlays/
│       ├── dev/                # Development environment
│       │   ├── kustomization.yaml
│       │   ├── replacements.yaml
│       │   ├── .config.env     # Dev-specific config
│       │   ├── .secrets.env    # Dev secrets
│       │   └── dashboard-admin.yaml
│       └── prod/               # Production environment
│           ├── kustomization.yaml
│           ├── replacements.yaml
│           ├── .config.env     # Prod-specific config
│           └── .secrets.env    # Prod secrets
```

## Configuration Management

### Environment Files

All configuration is managed through `.config.env` and `.secrets.env` files (gitignored for security):

**`.config.env`** - Non-sensitive configuration:
- Docker images and tags
- Service ports
- Service URLs
- Frontend public variables
- Admin email and CORS settings

**`.secrets.env`** - Sensitive data:
- JWT secrets
- API keys (Google, MSF)
- Database passwords
- Redis passwords

### Key Environment Variables

#### Docker Images
```bash
API_GATEWAY_IMAGE=csecyber/cyber-suite-api-gateway:latest
DASHBOARD_IMAGE=csecyber/cyber-suite-dashboard:latest
DB_SCANNER_IMAGE=csecyber/database-security-scanner:latest
# ... etc
```

#### Service Ports
```bash
API_GATEWAY_PORT=α
DASHBOARD_PORT=α
DB_SCANNER_PORT=γ
WEB_SCANNER_PORT=β
MISCONFIG_PORT=δ
CODE_SCANNER_PORT=ζ
API_TESTER_PORT=ε
REDIS_PORT=ρ
METASPLOIT_PORT=μ
```

#### Frontend Configuration
```bash
FRONTEND_ORIGIN=http://cyber-suite-dashboard:α
NEXT_PUBLIC_WEB_SCANNER_BASE=/api/gateway/web-scanner
NEXT_PUBLIC_DATABASE_SCANNER_URL=/api/gateway/database-scanner
# ... etc
```

#### Secrets
```bash
JWT_SECRET=<your-secret>
MSF_PASSWORD=<metasploit-password>
GOOGLE_API_KEY=<your-api-key>
REDIS_PASSWORD=<redis-password>
```

## Deployment Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Deployment-Repo
```

### 2. Configure Environment Files

Create and configure your environment files:

```bash
# Copy templates
cp k8s/.config.env k8s/overlays/dev/.config.env
cp k8s/.secrets.env k8s/overlays/dev/.secrets.env
cp k8s/.config.env k8s/overlays/prod/.config.env
cp k8s/.secrets.env k8s/overlays/prod/.secrets.env
```

Edit each file with your specific values:
- Update Docker image tags
- Set API keys and secrets
- Configure service URLs for your environment

### 3. Deploy to Development

The development overlay includes monitoring tools (Metrics Server + Kubernetes Dashboard):

```bash
# Apply development configuration
kubectl apply -k k8s/overlays/dev

# Verify deployment
kubectl get pods -n cyber-suite
kubectl get pods -n kubernetes-dashboard

# Access Kubernetes Dashboard
kubectl proxy
# Open: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

# Get dashboard token
kubectl create token admin-user -n kubernetes-dashboard
```

### 4. Deploy to Production

The production overlay excludes monitoring tools for a lightweight deployment:

```bash
# Apply production configuration
kubectl apply -k k8s/overlays/prod

# Verify deployment
kubectl get pods -n cyber-suite
```

### 5. Access the Platform

**Via Ingress (if configured):**
- Dashboard: `https://<your-domain>`
- API Gateway: `https://<your-domain>/api/gateway`

**Via Port Forwarding (local testing):**
```bash
kubectl port-forward -n cyber-suite svc/dashboard α:α
kubectl port-forward -n cyber-suite svc/api-gateway θ:α
```

Then access:
- Dashboard: `http://localhost:α`
- API Gateway: `http://localhost:θ`

## Updating Deployments

### Update Configuration
```bash
# Edit your .config.env or .secrets.env files
vim k8s/overlays/prod/.config.env

# Reapply
kubectl apply -k k8s/overlays/prod
```

### Update Docker Images
```bash
# Update IMAGE tags in .config.env
# Then reapply to trigger rolling update
kubectl apply -k k8s/overlays/prod
```

### Clean Restart
```bash
# Delete everything
kubectl delete -k k8s/overlays/prod

# Reapply fresh
kubectl apply -k k8s/overlays/prod
```

## Monitoring (Dev Environment)

### Kubernetes Dashboard
```bash
kubectl proxy
# Open: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Metrics Server
```bash
# View resource usage
kubectl top pods -n cyber-suite
kubectl top nodes
```

### View Logs
```bash
# Specific pod
kubectl logs -f <pod-name> -n cyber-suite

# All pods of a deployment
kubectl logs -f deployment/api-gateway -n cyber-suite

# Follow logs
kubectl logs -f deployment/db-security-scanner -n cyber-suite --tail=100
```

## Troubleshooting

### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n cyber-suite

# Describe pod for events
kubectl describe pod <pod-name> -n cyber-suite

# Check logs
kubectl logs <pod-name> -n cyber-suite
```

### ConfigMap/Secret Issues
```bash
# Verify ConfigMap exists
kubectl get configmap cyber-suite-dynamic-config -n cyber-suite -o yaml

# Verify Secret exists
kubectl get secret cyber-suite-secrets -n cyber-suite

# Check if they're in the correct namespace
kubectl get configmap,secret -A | grep cyber-suite
```

### Resource Constraints
```bash
# Check resource usage
kubectl top pods -n cyber-suite

# Check node capacity
kubectl describe nodes
```

### Image Pull Errors
```bash
# Check image names in .config.env
# Verify Docker Hub credentials if using private images
kubectl get events -n cyber-suite | grep Failed
```

## Security Best Practices

1. ✅ **Never commit `.config.env` or `.secrets.env`** to Git
2. ✅ Use strong, unique secrets for `JWT_SECRET`, `MSF_PASSWORD`, etc.
3. ✅ Rotate secrets regularly in production
4. ✅ Use Kubernetes Secrets for sensitive data (already implemented)
5. ✅ Enable RBAC in production clusters
6. ✅ Use network policies to isolate services
7. ✅ Keep Docker images updated with security patches

## Environment Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Monitoring | ✅ Metrics Server + Dashboard (v1.24+ Auth)<br/>✅ Prometheus + Grafana (Namespace: `default`) | ❌ Excluded |
| Resource Limits | Relaxed | Strict |
| Log Level | DEBUG | INFO/WARN |
| Replicas | 1 per service | Configurable (HA) |

## Observability & Monitoring Details

### Prometheus & Grafana Namespace Alignment
- **Namespace:** Deployed under the `default` namespace (controlled via `k8s/monitoring/kustomization.yaml` settings).
- **Service Discovery & Scrapes:** ServiceAccount scrape credentials and cluster RBAC rules are bound to the `default` namespace. All 8 microservices expose native `/metrics` endpoints scraped automatically.
- **Docusaurus Docs Metrics:** The documentation site serves metrics from Nginx on the `/docs/metrics.txt` path (configured via `prometheus.io/path` annotations).

### Kubernetes Dashboard Authentication (K8s 1.24+)
- An explicit Kubernetes Secret resource of type `kubernetes.io/service-account-token` is bound to the `admin-user` ServiceAccount within `k8s/overlays/dev/dashboard-admin.yaml`.
- This ensures token authentication token is persistent and remains valid for logins under Kubernetes v1.24+.

## CI/CD Automation Workflows

We use a dual-tier GitHub Actions integration model to build and roll out updates:

### 1. Standardized Microservice CI/CD Pipelines
Every microservice repository has `.github/workflows/deploy.yml` which triggers on a push to `main` branch:
- **Registry & Image Targets:** Pushes to the `csecyber` Docker Hub namespace (e.g. `csecyber/api-tester`, `csecyber/cyber-suite-dashboard`, etc.).
- **Dockerfile Paths:** Custom paths are automatically handled (such as `./Dockerfile.offline` for `Cyber-Suite-Docs`).
- **Tagging Strategy:** Standardized to produce two tags for every build: `:latest` and the commit hash `:${{ github.sha }}`.
- **Cache Optimization:** Utilizes `docker/setup-buildx-action@v3` and GitHub Actions native layer caching (`cache-from: type=gha`, `cache-to: type=gha,mode=max`) to speed up subsequent image builds.
- **Ignore Rules:** All repositories use optimized `.dockerignore` files ignoring `.github/`, `.git/`, and local files to ensure changes to workflow scripts do not trigger Docker context invalidation.

### 2. Manual Server Deployment Workflow
The `Deployment-Repo` contains a central manual deployment pipeline inside `.github/workflows/deploy-server.yml`:
- **Trigger:** Configured with `workflow_dispatch` (triggered manually from the GitHub UI).
- **Inputs:** A choice input named `overlay` allowing selection between `dev` and `prod`.
- **Target VM SSH Connection:** Utilizes `appleboy/ssh-action@v1.0.3` using credentials `SERVER_HOST`, `SERVER_USER`, and `SERVER_SSH_KEY`.
- **Deployment Script Commands:**
  ```bash
  cd ~/Deployment-Repo
  git pull origin main
  kubectl apply -k k8s/overlays/${{ github.event.inputs.overlay }}
  kubectl rollout restart deployment -n cyber-suite
  ```

## Scaling

### Horizontal Pod Autoscaling
```bash
# Example: Scale web scanner workers
kubectl autoscale deployment web-scanner-service-worker \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n cyber-suite
```

### Manual Scaling
```bash
# Scale deployment replicas
kubectl scale deployment web-scanner-service-worker --replicas=5 -n cyber-suite
```

## Cleanup

### Remove Deployment (Keep Namespace)
```bash
kubectl delete -k k8s/overlays/prod
```

### Complete Cleanup
```bash
kubectl delete namespace cyber-suite
kubectl delete namespace kubernetes-dashboard  # Dev only
```
