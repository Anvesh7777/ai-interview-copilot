# AI Interview Copilot 🚀

AI Interview Copilot is an intelligent interview preparation platform that helps users optimize resumes, analyze ATS compatibility, practice mock interviews, and generate personalized revision plans using AI.

## ✨ Features

### 📄 Resume Analysis

* Upload your resume in PDF format
* Extracts and parses resume content
* Generates structured candidate insights

### 🎯 ATS Report Generation

* Matches resume against Job Description (JD)
* Generates ATS compatibility score
* Highlights strengths, weaknesses, and suggestions

### 💼 Job Description Analysis

* Upload JD PDFs
* Extracts role, experience, and relevant keywords
* Enables ATS comparison and targeted interview prep

### 🎤 AI Mock Interviews

* Domain-specific interview generation
* Technical questions based on selected stack
* Timer-based interview experience
* AI-generated feedback report

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

* Generates personalized revision roadmap
* Prioritizes weak topics
* Recommends resources
* Estimates completion time

### 📜 History Tracking

* Stores previous ATS reports
* Stores interview history
* Enables progress tracking

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

### AI / LLM

* Groq API
* LangChain
* ChromaDB (Vector Store)
* RAG Pipeline

---

## 🏗 System Architecture

```text
Frontend (React)
        |
        v
Backend (Express)
        |
        +--> MongoDB
        +--> Redis
        +--> Cloudinary
        +--> Groq LLM
        +--> ChromaDB
```

---

## 📂 Project Structure

```text
ai-interview-copilot/
│── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── api/
│   └── context/
│
│── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── config/
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Anvesh7777/ai-interview-copilot.git
cd ai-interview-copilot
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
REDIS_URL=your_redis_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CHROMA_HOST=your_chroma_host
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

---

## 🚀 Deployment

### Frontend

Deployed on Vercel

### Backend

Deployed on Render

### Database

MongoDB Atlas

### File Storage

Cloudinary

### Vector Database

ChromaDB

---

## 🔐 Authentication

* JWT based authentication
* Protected routes
* Google OAuth support

---

## 📌 API Routes

### Resume

* `POST /api/resume/upload`

### Job Description

* `POST /api/job-description/upload`

### ATS

* `GET /api/ats/report`

### Interview

* `POST /api/interview/start`
* `POST /api/interview/submit`
* `GET /api/interview/report`
* `GET /api/interview/revision-plan`

### History

* `GET /api/history`

---

## 🔥 Future Improvements

* Voice-based mock interviews
* Live coding interview environment
* Company-specific interview rounds
* Resume improvement suggestions
* Analytics dashboard

---

## 👨‍💻 Author

**Anvesh Mahajan**

* GitHub: [https://github.com/Anvesh7777](https://github.com/Anvesh7777)
* LinkedIn: [https://www.linkedin.com/in/anvesh77/](https://www.linkedin.com/in/anvesh77/)

---

## ⭐ Support

If you found this project useful, consider starring the repository.

