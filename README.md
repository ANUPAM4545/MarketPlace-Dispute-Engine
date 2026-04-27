<div align="center">
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
</div>

<h1 align="center">⚖️ DisputeEngine.tech</h1>

<p align="center">
  <strong>The Gold Standard for E-Commerce Resolution & Automated Mediation.</strong><br>
  <em>An enterprise-grade platform empowering Buyers, Sellers, and Admins with a seamless, AI-ready resolution pipeline.</em>
</p>

---

## 🏛️ Enterprise Infrastructure (AWS Primary)

The platform is officially hosted on a highly available, globally distributed AWS stack ensuring 99.9% uptime and immutable data integrity.

- **🌐 Frontend (Production):** [disputeengine.tech](https://disputeengine.tech)
- **⚙️ Backend API (AWS App Runner):** Scalable, containerized Python Flask instance.
- **🐘 Database (AWS RDS):** Managed PostgreSQL cluster for high-fidelity transactional storage.
- **🖼️ Asset Storage (AWS S3):** Secure, immutable object storage for dispute evidence and product media.

---

## ✨ High-Performance Features

### 🛡️ Role-Based Access Control (RBAC)
Dedicated, high-fidelity dashboards for three distinct user personas:
- **Buyers**: Seamlessly flag orders, track resolution status, and submit evidence.
- **Sellers**: Manage inventory (S3-backed), respond to claims, and authorize refunds.
- **Administrators**: Overlook the entire ecosystem with global metrics and advanced moderation tools.

### 📋 Visual Resolution Pipeline (Kanban)
A stunning, drag-and-drop moderation board (powered by `@hello-pangea/dnd`) allowing Admins to manage the entire dispute lifecycle—from `OPEN` to `RESOLVED`—with zero friction.

### 📧 Intelligent Notification Engine
Automated SMTP relay system delivering real-time status updates, onboarding emails, and support inquiry notifications directly to your inbox.

### 📊 Real-Time Analytics Dashboard
Dynamic data visualization (via `recharts`) providing high-level operational intelligence:
- Dispute Volume Tracking.
- Resolution Time Metrics.
- User Engagement Analytics.

---

## 🏗️ Technical Architecture

### 🎨 Frontend (The Experience Layer)
Built with **React 19** and **TypeScript**, focused on a "Midnight & Gold" premium aesthetic.
- **Styling**: Tailwind CSS v4 with custom utility management.
- **Animations**: Framer Motion for liquid transitions and micro-interactions.
- **State Management**: Context API for global auth and theme persistence.

### 🧠 Backend (The Logic Layer)
A stateless, robust **RESTful API** powered by **Python Flask**.
- **Security**: Hardened JWT Bearer token authentication.
- **CORS**: Enterprise-grade Cross-Origin Resource Sharing security.
- **Storage**: Integrated AWS SDK (`boto3`) for secure S3 communication.

---

## 💻 Local Development

Experience the full stack in your local environment.

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
> Bind Address: `http://localhost:5001`

### 2. Frontend Setup
```bash
cd react-frontend
npm install
npm run dev
```
> Access Point: `http://localhost:5173`

---

## 📝 License & Vision

Distributed under the **MIT License**. This project is built to transform how marketplaces handle conflicts—turning disputes into trust-building opportunities.

<div align="center">
  <sub>Built with ❤️ by Anupam Singh | Powered by AWS</sub>
</div>
