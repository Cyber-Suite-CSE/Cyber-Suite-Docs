---
sidebar_position: 2
---

<head>
  <title>Kubernetes Cluster Setup | Vigilion Docs</title>
  <meta name="description" content="Guide to setting up a server-grade Kubernetes cluster using K3s with Traefik Ingress, configuring DNS subdomains, and securing it using Let's Encrypt certificates generated via Certbot." />
</head>

# Kubernetes Cluster Setup

This page guides you through setting up a server-grade Kubernetes cluster on your host VM using **K3s with its default Traefik Ingress controller**, configuring Ingress routing, and securing the platform using **Certbot with Let's Encrypt certificates**.

---

## 1. K3s Cluster Installation

K3s by Rancher is an officially certified Kubernetes distribution packaged as a single binary, ideal for resource-constrained VM servers. It runs natively as a systemd service and includes Traefik as the default Ingress controller.

### 1. Install K3s (Default Configuration)
Run the K3s installation script on your host server. This will install Kubernetes and activate Traefik automatically:
```bash
curl -sfL https://get.k3s.io | sh -
```

### 2. Configure kubectl Permissions
Set up permissions for your user (e.g., `<SERVER_USER>`) to access the cluster:
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
chmod 600 ~/.kube/config

# Add config path to environment variables
echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc
source ~/.bashrc
```

Verify that the cluster is healthy and the node is ready:
```bash
kubectl get nodes
```

---

## 2. Ingress Routing with Traefik

K3s installs with the **Traefik** ingress controller by default. Traefik listens on host ports `80` and `443` and automatically routes requests to our cluster workloads.

### Ingress Manifest Configuration
To map traffic coming to the server domain (`vigilion.cse.mrt.ac.lk`) to our services, configure the Ingress resource inside the `Deployment-Repo` at `k8s/base/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cyber-suite-ingress
  namespace: cyber-suite
  annotations:
    # Set Traefik entrypoints and link the HTTPS redirection middleware
    traefik.ingress.kubernetes.io/router.entrypoints: web, websecure
    traefik.ingress.kubernetes.io/router.middlewares: cyber-suite-redirectscheme@kubernetescrd
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - vigilion.cse.mrt.ac.lk
      secretName: cyber-suite-tls
  rules:
    - host: vigilion.cse.mrt.ac.lk
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: cyber-suite-dashboard
                port:
                  number: 3000
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 3000
```

---

## 3. HTTPS & Let's Encrypt Certificate Setup

We secure dashboard communication by terminating SSL/TLS at the Traefik Ingress controller using a Let's Encrypt certificate. Instead of in-cluster managers, we obtain certificates directly on the host VM using **Certbot**.

### Step 1: Obtain Let's Encrypt Certificates via Certbot
1.  **Install Certbot on the VM:**
    ```bash
    sudo apt-get update
    sudo apt-get install certbot -y
    ```
2.  **Temporarily Stop K3s:**
    Since Traefik is running and listening on port `80`, temporarily stop K3s to allow Certbot to bind to port 80 and solve the Let's Encrypt HTTP-01 challenge:
    ```bash
    sudo systemctl stop k3s
    ```
3.  **Run Certbot in Standalone Mode:**
    Execute the following command (replacing with your domain and administrative email):
    ```bash
    sudo certbot certonly --standalone -d vigilion.cse.mrt.ac.lk --email webmaster@example.com --agree-tos --no-eff-email
    ```
    *This generates the certificate files and saves them under `/etc/letsencrypt/live/vigilion.cse.mrt.ac.lk/`.*
4.  **Restart K3s:**
    ```bash
    sudo systemctl start k3s
    ```

### Step 2: Import the Certificates into Kubernetes
Create a Kubernetes TLS Secret in the `cyber-suite` namespace containing the Let's Encrypt files:
```bash
sudo kubectl create secret tls cyber-suite-tls \
  --cert=/etc/letsencrypt/live/vigilion.cse.mrt.ac.lk/fullchain.pem \
  --key=/etc/letsencrypt/live/vigilion.cse.mrt.ac.lk/privkey.pem \
  -n cyber-suite
```

---

## 4. Configuring Traefik HTTPS Redirection

To force all incoming HTTP traffic on port 80 to automatically redirect to HTTPS on port 443, we must deploy a Traefik **Middleware** custom resource.

### 1. Create the Middleware Resource
Create a manifest named `traefik-redirect-middleware.yaml`:
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: cyber-suite-redirectscheme
  namespace: cyber-suite
spec:
  redirectScheme:
    scheme: https
    permanent: true
```

Apply it to your cluster:
```bash
kubectl apply -f traefik-redirect-middleware.yaml
```

### 2. Verify Ingress Redirection
Verify that the `cyber-suite-redirectscheme@kubernetescrd` middleware is linked in your `k8s/base/ingress.yaml` under `metadata.annotations`. Once Kustomize applies the manifests, Traefik will automatically handle incoming HTTP request redirection to HTTPS.
