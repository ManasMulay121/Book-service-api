# Book Service API - Web App

A simple full-stack project for managing books and authors with JWT authentication.

## Features
- RESTful API for books and authors (CRUD)
- JWT-based authentication
- PostgreSQL database
- React frontend (Material UI)
- Dockerized with HTTPS (mkcert)

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, PostgreSQL
- **Frontend:** React, TypeScript, Material UI
- **Infra:** Docker, Nginx, mkcert

## Quick Start
1. **Clone the repo**
2. **Generate SSL certs** (see below)
3. **Set up `.env`** (see `.env.example` or comments in `.env`)
4. **Start with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
5. **Visit:** [https://localhost](https://localhost)

## SSL Certificates
- Create your own SSL certificates using mkcert for creating them
- [mkcert](https://github.com/FiloSottile/mkcert):
  ```sh
  mkcert -install
  mkcert -key-file certs/localhost+1-key.pem -cert-file certs/localhost+1.pem localhost 127.0.0.1
  ```

## Project Structure
- `client/` – React frontend
- `server/` – Express backend
- `nginx/` – Nginx config
- `certs/` – Local SSL certs (not committed)

---
**Note:**
Need to add your own .env
Include the certs directory in the root consisting of certificates

