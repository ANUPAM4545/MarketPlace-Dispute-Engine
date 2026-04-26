<h1 align="center">⚖️ Marketplace Dispute Engine</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <br/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br />

<p align="center">
  <strong>A premium, high-performance resolution center built for modern multi-vendor marketplaces.</strong><br>
  <em>Empowering Buyers, Sellers, and Administrators with seamless role-based workflows, evidence tracking, and a powerful visual Kanban board.</em>
</p>

---

## 🚀 Production Infrastructure (AWS)

The platform is officially hosted on a highly available AWS enterprise stack:
- **Frontend (AWS Amplify):** [main.del6ffb4i1wi8.amplifyapp.com](https://main.del6ffb4i1wi8.amplifyapp.com/)
- **Backend API (AWS App Runner):** Scalable, containerized Flask instance.
- **Database (AWS RDS):** Managed PostgreSQL instance for high data integrity.
- **Storage (AWS S3):** Secure object storage for immutable evidence and proof images.

---

## ✨ Key Platform Features

**Marketplace Dispute Engine** abstracts the complex logic of e-commerce conflicts into a beautiful, linear pipeline.

- **🛡️ Secure Role-Based Access Control (RBAC):** Distinct dashboards and isolated capabilities tailored for **Buyers**, **Sellers**, and **Administrators** with hardened JWT verification.
- **📋 Admin Kanban Board:** A stunning visual board (powered by `@hello-pangea/dnd`) for Admins to visually drag-and-drop disputes through critical stages (`OPEN` ➔ `UNDER_REVIEW` ➔ `SELLER_RESPONDED` ➔ `RESOLVED` / `REJECTED`).
- **📧 Intelligent Email Notifications:** Integrated **SMTP relay** (via Gmail/Google App Passwords) providing automated, role-specific onboarding emails and real-time status update alerts to all parties.
- **📎 Immutable Proof Management:** A specialized evidence upload module allowing both buyers and sellers to attach visual and document proof directly to dispute threads.
- **💪 Advanced Data Integrity:** Comprehensive database seeding with professional "Market Data" ensuring a ready-to-test environment upon deployment.
- **💬 Real-Time Dispute Threading:** A centralized messaging and resolution panel tracking every interaction between the opposing parties and moderators.
- **📊 Operational Analytics:** High-level dynamic charting tracking global metrics (Total Active Users, Order Volume, Active vs. Closed Disputes) to monitor platform health.
- **🕵️ Fraud & Suspicion Detection:** Intelligent flagging schemas isolating potentially suspicious claims automatically based on evidence metadata comparisons.

---

## 🏗️ System Architecture

The application implements a decoupled, modern SaaS architecture ensuring robust scalability and exceptional user experience.

### Frontend Layer (React / Vite)
A bleeding-edge single-page application focused on high fidelity and performance.
- **Core:** React 19, TypeScript, Vite
- **Styling Architecture:** Tailored "Midnight & Gold" aesthetic utilizing **Tailwind CSS v4** and `clsx` for utility management.
- **Routing:** React Router v7 with dynamic, role-protected routes.
- **Data Visualization:** `recharts` for interactive dashboards.
- **API Interceptors:** Customized `Axios` instances handling JWT bearer injections automatically.

### Backend Layer (Flask / Database)
A stateless, robust JSON API powering the complex resolution logic.
- **Framework:** Python Flask serving RESTful endpoints.
- **Database Schema:** Defined via **Flask-SQLAlchemy**. Relationships connecting Users (`1:M`), Orders (`1:1`), Disputes (`1:M` Evidence/Messages).
- **Authentication Strategy:** Secure JWT generation and verification via `flask-jwt-extended`.
- **Cors & Security:** `flask-cors` locking down resource sharing to designated client URLs.
- **Production Server:** Deployed via `gunicorn`.

---

## 💻 Getting Started (Local Development)

To run the full stack locally on your machine, follow these steps:

### 1. Initialize the Backend
Navigate to the backend directory, install packages, and boot the server.
```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install the required server dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```
> The API will bind natively to `http://localhost:5000`.

### 2. Initialize the Frontend
In a new terminal window, load the frontend assets.
```bash
cd react-frontend

# Install node dependencies
npm install

# Boot the Vite hot-reloading server
npm run dev
```
> The React UI will be available at `http://localhost:5173`.

---

## 📖 The Resolution Workflow

The engine dictates a strict, logical path for every incident:

1. **Initiation:** A **Buyer** flags a past order, attaching an initial claim description.
2. **Review:** The Dispute opens. **Sellers** are notified and provided a portal to submit counter-claims or authorize a refund.
3. **Escalation:** If unresolved between parties, the status shifts to `UNDER_REVIEW`.
4. **Adjudication:** A platform **Administrator** enters the thread, reviews the attached evidence streams from both parties, utilizes the Kanban module, and forces a specific resolution (`REFUND`, `PARTIAL_REFUND`, or `REJECT`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are highly welcome! 
If you plan to implement major architectural changes, please open an issue first to discuss what you would like to change.

## 📝 License

This software is provided under the **MIT License**. See the `LICENSE` file for full details. Build amazing, safe marketplaces.
