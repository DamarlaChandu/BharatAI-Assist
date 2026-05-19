# 🌾 BharatAI Assist

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/frontend-React-blue)
![Express](https://img.shields.io/badge/backend-Express-green)
![AI](https://img.shields.io/badge/AI-Gemini_&_HuggingFace-orange)

A powerful full-stack web application designed to empower rural India by bridging the gap between advanced AI and local languages. BharatAI Assist provides voice-first, multilingual guidance for agriculture and healthcare, ensuring essential knowledge is accessible to everyone.

## 🚀 Features

- **🌾 Agriculture Assistant:** Get insights on crop diseases, farming techniques, and Mandy prices.
- **⚕️ Healthcare Assistant:** AI-powered health advice and symptom checking.
- **🗣️ Voice & Multilingual:** Interact in your local language using voice commands.
- **🤖 Advanced AI Integration:** Powered by Google Gemini and HuggingFace APIs.
- **⚡ Full-stack Architecture:** Robust backend with Express.js and dynamic frontend with React & Tailwind CSS.

## 📂 Project Structure

```text
BharatAI-Assist/
│
├── backend/          # Express server, API routes, controllers, and AI integrations
│   ├── routes/       # API endpoints (agricultureAI, healthAPI, mandiAPI, etc.)
│   ├── server.js     # Entry point for the backend
│   └── .env          # Environment variables
│
├── frontend/         # React frontend powered by Vite
│   ├── src/          # React components, pages (Agriculture, Healthcare, Home)
│   ├── public/       # Static public assets
│   └── package.json  # Frontend dependencies
│
├── .gitignore
└── README.md
```

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **AI / Automation** | Google Gemini API, HuggingFace Inference API, Composio MCP |

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/DamarlaChandu/BharatAI-Assist.git
cd BharatAI-Assist
```

### 2️⃣ Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file inside the `/backend` directory and add the following keys. (You can add your actual keys):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 4️⃣ Run the project

**Run backend:**
```bash
cd backend
npm start
```

**Run frontend:**
```bash
cd ../frontend
npm run dev
```

## 👨‍💻 Author

**Damarla Chandu**
- 📧 E-mail: damarlachandu4@gmail.com
- 🌐 LinkedIn: [chandu-damarla](https://www.linkedin.com/in/chandu-damarla/)
