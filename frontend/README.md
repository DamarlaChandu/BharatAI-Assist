# 🧠 MCP Fullstack Project

A full-stack web application built using **Node.js**, **Express**, and **React**, integrating the **Composio MCP platform** for enhanced AI and automation features.

---

## 🚀 Features
- 🖥️ Full-stack architecture (Frontend + Backend)
- ⚙️ RESTful API with Express.js
- 🤖 Integration with Composio MCP & LinkedIn MCP server
- 🔒 Secure environment configuration via `.env`
- 🧩 Modular folder structure (`frontend`, `backend`)
- 🗂️ Version control using Git & GitHub

---

## 📂 Project Structure
mcp-fullstack-project/
│
├── backend/ # Express server, routes, controllers
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── server.js
│ └── .env
│
├── frontend/ # React frontend (Vite/CRA)
│ ├── src/
│ ├── public/
│ └── package.json
│
├── .gitignore
├── README.md
└── package.json

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/DamarlaChandu/BharatAI-Assist.git
cd mcp-fullstack-project
2️⃣ Install dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
3️⃣ Create a .env file inside /backend
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
4️⃣ Run the project
# Run backend
cd backend
npm start

# Run frontend
cd ../frontend
npm run dev
🧰 Tech Stack
| Layer               | Technology                 |
| ------------------- | -------------------------- |
| **Frontend**        | React, Tailwind CSS, Axios |
| **Backend**         | Node.js, Express.js        |
| **Database**        | MongoDB (Mongoose ODM)     |
| **AI / Automation** | Composio MCP, Gemini API   |

👨‍💻 Author
Damarla Chandu
📧 E-mail:damarlachandu4@gmail.com

🌐 Linkedin:https://www.linkedin.com/in/chandu-damarla/
