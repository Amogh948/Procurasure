# Deployment Guide - Procurasure

This guide explains how to deploy the Procurasure platform to production.

## 1. Frontend (Vercel)

1.  Push your code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com).
3.  Click **New Project** and import the `procurasure` repository.
4.  Set the **Root Directory** to `frontend`.
5.  Configure Environment Variables:
    - `VITE_API_URL`: Your backend API URL (e.g., `https://api.procurasure.com`).
6.  Click **Deploy**.

## 2. Backend (AWS EC2)

### Prerequisites
- An AWS account.
- An EC2 instance (Ubuntu 22.04 recommended).
- A domain name (optional but recommended).

### Steps
1.  **SSH into your instance**:
    ```bash
    ssh -i your-key.pem ubuntu@your-instance-ip
    ```
2.  **Install Node.js & PM2**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g pm2
    ```
3.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/procurasure.git
    cd procurasure/backend
    ```
4.  **Install dependencies**:
    ```bash
    npm install
    ```
5.  **Setup Environment Variables**:
    Create a `.env` file and fill in the details (MongoDB URI, JWT Secret, Google Auth credentials, SMTP details).
6.  **Start the server with PM2**:
    ```bash
    pm2 start server.js --name procurasure-api
    ```
7.  **Setup Reverse Proxy (Nginx)**:
    - Install Nginx: `sudo apt install nginx`
    - Configure Nginx to forward port 80/443 to port 5000.

## 3. CI/CD Secrets (GitHub)

To enable the automated pipeline, add the following secrets in **Settings > Secrets and variables > Actions**:

- `VERCEL_TOKEN`: Your Vercel API token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `AWS_HOST`: Your EC2 public IP or domain.
- `AWS_USERNAME`: Usually `ubuntu`.
- `AWS_SSH_KEY`: Your private SSH key (`.pem` content).

## 4. Google OAuth Setup

1.  Go to [Google Cloud Console](https://console.cloud.google.com).
2.  Create a new project.
3.  Configure **OAuth Consent Screen**.
4.  Create **OAuth 2.0 Client IDs**.
5.  Set **Authorized Redirect URIs**:
    - `http://localhost:5000/api/auth/google/callback` (for development)
    - `https://your-api.com/api/auth/google/callback` (for production)
