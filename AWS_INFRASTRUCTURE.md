# 🏛️ AWS Masterclass: Marketplace Dispute Engine Architecture

This document serves as your complete technical manual and learning guide for the cloud infrastructure powering your application. It explains **what** each service is, **how** it functions, and **why** it was chosen.

---

## 🏗️ High-Level System Flow

1.  **Request**: A user opens your URL in their browser.
2.  **Frontend**: **AWS Amplify** sends the React code to the user.
3.  **Action**: The user uploads a product photo (e.g., a Drone).
4.  **Processing**: **AWS App Runner** receives the photo, validates the user, and talks to **IAM**.
5.  **Storage**: App Runner sends the photo to the **S3 Warehouse**.
6.  **Recording**: App Runner saves the photo's link in the **RDS Vault**.
7.  **Response**: The user sees "Product Listed Successfully!" with their photo visible.

---

## 🖥️ 1. AWS Amplify (The Face of the App)

### ❓ What is it?
Amplify is a complete "Console-to-Cloud" tool for modern web apps. It handles the deployment and hosting of your React frontend.

### ⚙️ How it Works:
- **Build Pipeline**: Every time you `git push`, Amplify detects the change. It spins up a temporary machine, runs `npm run build`, and takes the resulting "dist" folder.
- **CDN Distribution**: Instead of hosting your site on one server in one city, Amplify copies your site to **Edge Locations** all over the world (CloudFront). 
- **Atomic Deploys**: Your site never goes "down" during an update. Amplify only switches to the new version once the build is 100% successful.

---

## ⚙️ 2. AWS App Runner (The Engine)

### ❓ What is it?
A fully managed service that makes it easy to deploy containerized web applications at scale.

### ⚙️ How it Works:
- **Containerization**: Your Python code is packaged into a "Container" (using Docker logic). 
- **Provisioning**: When you start App Runner, it automatically creates a secure environment with the exact RAM and CPU you specified.
- **Dynamic Routing**: It provides a secure `https://` endpoint automatically. When a request hits that URL, App Runner routes it into your Flask app.
- **Auto-Scaling**: If 1,000 people use your app at once, App Runner detects the high CPU usage and automatically starts more copies of your app to handle the load.

---

## 🐘 3. AWS RDS (The Memory)

### ❓ What is it?
RDS is a managed service for Relational Databases (SQL). 

### ⚙️ How it Works:
- **Storage Management**: AWS manages the physical disks. If your data grows, AWS expands the storage automatically.
- **Automated Backups**: RDS takes a "Snapshot" of your data every day. If you accidentally delete your users, you can "roll back" time to yesterday.
- **Security Groups**: This is the "Bouncer." RDS is hidden in a private network. It only accepts connections from your App Runner IP address on Port 5432. Even if someone has your password, they can't connect unless they are "on the list."

---

## 🖼️ 4. AWS S3 (The File Cabinet)

### ❓ What is it?
Simple Storage Service (S3) is the industry standard for storing images, videos, and documents.

### ⚙️ How it Works:
- **Buckets & Objects**: Files are stored as "Objects" in "Buckets." Each object has a unique URL.
- **99.999999999% Durability**: When you upload your Drone photo, AWS actually makes **three copies** of it across three different physical data centers. Even if one building burns down, your photo is safe.
- **Versioning**: It can keep a history of your files. If you overwrite an image, you can still retrieve the old version.

---

## 🔐 5. AWS IAM (The Security Guard)

### ❓ What is it?
Identity and Access Management (IAM) is the central security system of the entire AWS cloud.

### ⚙️ How it Works:
- **Authentication**: Checks "Who are you?" (Access Keys/Passwords).
- **Authorization**: Checks "What are you allowed to do?" (Policies).
- **Programmatic Access**: We created an **IAM User** and generated **Access Keys**. Your Python code uses these keys to "sign" every request it sends to S3. 
- **The Handshake**: When your backend tries to upload a photo, S3 asks IAM: *"Does this key have permission to write to the 'market-dispute' bucket?"* If IAM says yes, the photo is saved.

---

## 📈 6. Why this is "Enterprise Grade"

Previously, your app was "Local" (it lived on your computer). If your computer turned off, the app died. 
Now, your app is **Distributed**. It lives across multiple AWS data centers. 
- **If the database is slow?** AWS adds more power. 
- **If the images are deleted?** There are backups. 
- **If the code crashes?** App Runner restarts it automatically.

**This is the same infrastructure used by companies like Netflix and Airbnb.** You have built a truly professional system!
