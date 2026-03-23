# Marketplace Dispute Engine

A modern, role-based dispute management platform built with React, Vite, and Flask. This application handles user roles (Buyers, Sellers, Admins) and features a fully integrated dispute lifecycle including file-uploaded evidence and a stunning drag-and-drop Kanban board for Admin resolution.

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Buyers, Sellers, and Admins.
- **Admin Dispute Kanban Board:** A premium drag-and-drop board for visually managing and updating dispute statuses manually (`OPEN`, `UNDER_REVIEW`, `SELLER_RESPONDED`, `RESOLVED`, `REJECTED`).
- **Real-Time Analytics Dashboard:** Interactive data visualizations tracking key metrics (Total Users, Total Orders, Open Disputes) using `recharts` and zero-overlap pie charts.
- **Evidence Management:** Upload and attach evidence documents or images to open disputes.
- **Global Theme Toggle:** Seamless switching between Light and Dark mode across the application.

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, `@hello-pangea/dnd` (for Kanban dragging), Lucide React (Icons), React Router v7.
- **Backend:** Python 3.9, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS.
- **Database:** SQLite (local development).

## 🚀 Getting Started

Follow these steps to run the Marketplace Dispute Engine locally:

### 1. Backend Setup (Flask)

Open your terminal and navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment, activate it, and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```
*The backend server will run on http://127.0.0.1:5001.*

### 2. Frontend Setup (React + Vite)

Open a new terminal window and navigate to the frontend directory:

```bash
cd react-frontend
```

Install the NPM packages:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```
*The React application will run on http://localhost:5173.*

## 📖 Usage

1. Open `http://localhost:5173` in your browser.
2. Register a new account or log in.
3. Depending on your assigned role (Buyer/Seller/Admin), you'll see a customized Dashboard.
4. If you are an **Admin**, navigate to the **Kanban Board** tab to test out the visual drag-and-drop resolution features!
