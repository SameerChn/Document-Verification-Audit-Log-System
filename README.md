# Document Verification Audit Log System

A **production-style deployment** of a TypeScript / Node.js application on a **Microsoft Azure Virtual Machine**, using **Docker**, **NGINX reverse proxy**, **Dynamic DNS**, and **Let’s Encrypt HTTPS**.

---

## 🧱 Architecture Overview

User Browser
↓
HTTPS (443)
↓
Domain (DDNS)
↓
Azure VM (Static Public IP)
↓
NGINX (Reverse Proxy + SSL Termination)
↓
Docker Container (Private)
↓
TypeScript / Node.js App (localhost)
↓
Azure Cosmos DB

---

## ☁️ Infrastructure

### Virtual Machine
- **Cloud Provider**: Microsoft Azure
- **OS**: Ubuntu 22.04 LTS
- **VM Size**: B1s
- **Public IP**: **Static IPv4**

### Open Ports
| Port | Usage |
|----|----|
| 22 | SSH access |
| 80 | HTTP (redirects to HTTPS) |
| 443 | HTTPS |

Static IP ensures DNS and database firewall rules remain stable.

---

## 🐳 Dockerized Application

The application is containerized using Docker.

### Why Docker?
- Environment consistency
- Easy restarts and upgrades
- CI/CD compatibility
- Clean separation from host OS

---

## 🌐 NGINX Reverse Proxy

NGINX acts as a **reverse proxy** between the internet and the Docker container.

### Responsibilities
- Accept incoming HTTP/HTTPS traffic
- Forward requests to the Docker container
- Terminate SSL (HTTPS)
- Handle HTTP → HTTPS redirection

### Traffic Flow

Internet → NGINX (80/443) → localhost:3000 (Docker)

---

## 🔐 HTTPS with Let’s Encrypt

HTTPS is enabled using **Let’s Encrypt** and **Certbot**.

### Features
- Free SSL certificates
- Automatic certificate renewal
- Secure HTTPS access
- HTTP automatically redirects to HTTPS

### Auto-Renewal
Certbot installs a system timer to renew certificates automatically every 90 days.

---

## 🌍 Domain & Dynamic DNS (DDNS)

A **Dynamic DNS provider** is used to map a domain to the VM’s static public IP.

---

## 🗄️ Database: Azure Cosmos DB

The application connects to **Azure Cosmos DB**.

### Networking Configuration
- Azure VM uses a **static public IP**
- This IP is explicitly allowed in Cosmos DB firewall rules
- “Allow Azure services” is **not used**, as it does not include Azure VMs

### Result
- Secure access
- No unexpected connection failures
- Production-safe configuration

---

## 🔁 CI/CD Readiness

The project is structured to support **CI/CD with GitHub Actions**.

### Intended Pipeline Flow


git push
↓
GitHub Actions
↓
Build Docker image
↓
Push image to registry
↓
SSH into Azure VM
↓
Pull latest image
↓
Restart container


This enables **zero-manual redeploys** after initial setup.

---