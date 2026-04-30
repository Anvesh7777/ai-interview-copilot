# AI Interview Copilot 🚀

AI Interview Copilot is an AI-powered interview preparation platform that helps users analyze resumes, calculate ATS scores, practice mock interviews, and generate personalized revision plans.

## ✨ Features

### 📄 Resume Analysis

* Upload resume in PDF format
* Extract and analyze candidate profile
* Parse technical skills and experience

### 🎯 ATS Score Generation

* Compare resume against Job Description
* Generate ATS compatibility score
* Strengths and improvement suggestions

### 💼 Job Description Analysis

* Upload JD PDF
* Extract role, experience, and keywords
* Use for ATS matching and targeted prep

### 🎤 Mock Interview

* Domain-based interview generation
* AI-generated technical questions
* Timer-based interview simulation
* Detailed feedback report

Supported domains:

* Complete Interview
* Backend
* Frontend
* MERN
* React
* Node.js
* DSA
* System Design
* Core CS
* DBMS
* OS
* OOPs

### 📚 Revision Planner

* Personalized revision roadmap
* Weak-topic prioritization
* Resource recommendations
* Estimated completion time

### 📜 History Tracking

* ATS report history
* Interview history
* Performance tracking

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* Redis

### AI Stack

* Groq API
* LangChain
* ChromaDB
* RAG Pipeline

---

## 🏗 Architecture

```text
Frontend (React)
        |
        v
Backend (Express)
        |
        +--> MongoDB Atlas
        +--> Redis
        +--> Cloudinary
        +--> Groq API
        +--> ChromaDB
```

---

## 📂 Project Structure

```text
ai-interview-copilot/
│── frontend/
│── backend/
│── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Anvesh7777/ai-interview-copilot.git
cd ai-interview-copilot
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 .gitignore (Important)

```gitignore
node_modules/
.env
backend/.env
frontend/.env
backend/uploads/
dist/
build/
```

---

## 🚀 Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

### File Storage

* Cloudinary

### Vector Database

* ChromaDB

---

## 📌 API Routes

### Resume

* POST `/api/resume/upload`

### Job Description

* POST `/api/job-description/upload`

### ATS

* GET `/api/ats/report`

### Interview

* POST `/api/interview/start`
* POST `/api/interview/submit`
* GET `/api/interview/report`
* GET `/api/interview/revision-plan`

### History

* GET `/api/history`

---

## 🔥 Future Scope

* Voice interviews
* Live coding rounds
* Company-specific interview flows
* Analytics dashboard

---

## 👨‍💻 Author

**Anvesh Mahajan**

GitHub: [https://github.com/Anvesh7777](https://github.com/Anvesh7777)
LinkedIn: [https://www.linkedin.com/in/anvesh77/](https://www.linkedin.com/in/anvesh77/)

---

## ⭐ Support

If you found this useful, star the repo ⭐
