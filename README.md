<h1 align="center">⚖️ Marketplace Dispute Engine</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</div>

<br />

<p align="center">
  <strong>A modern, role-based dispute management platform built for modern marketplaces.</strong><br>
  <em>Streamline conflict resolution, upload encrypted evidence, and manage administrative workflows intuitively with our visual Kanban board.</em>
</p>

---

## ✨ Key Features

- **🛡️ Premium UI/UX:** A stunning, elegant "black and gold" theme optimized for modern aesthetics and usability.
- **🔐 Role-Based Access Control (RBAC):** Distinct dashboards, interactions, and capabilities tailored for **Buyers**, **Sellers**, and **Administrators**.
- **📋 Visual Kanban Board:** An interactive, drag-and-drop board powered by `@hello-pangea/dnd` allowing Admins to visually manage dispute stages (`OPEN` ➔ `UNDER_REVIEW` ➔ `SELLER_RESPONDED` ➔ `RESOLVED` / `REJECTED`).
- **📊 Real-Time Analytics Dashboard:** Interactive data visualizations (Total Users, Total Orders, Open Disputes) powered by `recharts`.
- **📎 Evidence Management:** Users can upload images and documents to attach critical evidence directly to open disputes.
- **⚡ Lightning Fast Pipeline:** Automated assignment rules and instant UI updates.

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Custom [Tailwind CSS v4](https://tailwindcss.com/) (Black & Gold Theme Architecture)
- **Icons & Charts:** [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Routing:** [React Router v7](https://reactrouter.com/)

### Backend Architecture
- **Framework:** [Flask](https://flask.palletsprojects.com/) (Python 3.9+)
- **ORM & Database:** Flask-SQLAlchemy, SQLite (Local Development)
- **Authentication:** JWT via Flask-JWT-Extended
- **Middleware:** Flask-CORS for cross-origin management

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Python** (v3.9 or higher)

### 1. Backend Setup (Flask)

Open your terminal and navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment, activate it, and install dependencies:

```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Initialize the Database and start the Flask server:

```bash
# Uses port 5000 by default
python app.py

# Or set a custom port
PORT=5001 python app.py
```
*The backend server will run on `http://127.0.0.1:5000` by default (or `http://127.0.0.1:${PORT}` if you set the `PORT` environment variable).*

### 2. Frontend Setup (React)

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd react-frontend
```

Install the NPM packages and start the Vite development server:

```bash
npm install
npm run dev
```
*The React application will run on `http://localhost:5173`.*

---

## 💻 Usage & Workflows

1. **Access the Application:** Open `http://localhost:5173` in your browser.
2. **Authentication:** Register a new account (select your role: Buyer or Seller) or log in.
3. **Role-Specific Scenarios:**
   - **Buyers:** Can view their past orders and initiate a new dispute against a purchase.
   - **Sellers:** Can view incoming disputes on their products and respond/upload counter-evidence.
   - **Administrators:** Log in with an Admin account to see the **Analytics** view and access the interactive **Kanban Board** to resolve or reject active disputes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! 
Feel free to check the [issues page] if you want to contribute.

## 📝 License

This project is open-source and available under the strictly non-commercial educational license.
