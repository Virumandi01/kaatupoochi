# Kaatupoochi 🐛 (Git History — Made Human)

**Kaatupoochi** is an AI-powered visualizer that transforms complex, technical Git commit logs into a human-readable, interactive calendar. Built for the **GitLab AI Hackathon**.

## 🚀 The Problem
Git history is intimidating for beginners and tedious for project managers to review. Raw code diffs (`+42 -15`) don't explain the *business value* or the *human intent* behind a code change.

## 💡 The Solution
Kaatupoochi acts as a professional code change reporter. It takes any GitHub or GitLab repository and visualizes its entire commit history as an interactive contribution calendar (like GitHub's green squares). When you click a day, it doesn't just show you code—it uses **Google Gemini 2.5 Flash** to translate technical commits into plain English, explaining *what* changed, *why* it matters, and *who* benefits.

## ✨ Features
- **Smart URL Detection:** Paste any GitHub or GitLab link to instantly analyze the repo.
- **Lightning Fast Architecture:** Loads the entire year's commit activity mapping instantly.
- **Interactive Calendar:** Navigate years, switch branches, and click any active day to dive deep.
- **AI Translation:** Gemini 2.5 Flash turns jargon into team-leader-ready summaries.
- **Rich Markdown Viewer:** Natively renders the repository's README right on the home screen.

## 🛠 Tech Stack
- **Frontend:** Next.js 15, React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **AI Model:** Google Gemini 2.5 Flash (@google/genai)
- **APIs:** GitHub REST API, GitLab API

## 💻 How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/kaatupoochi.git](https://github.com/YOUR_USERNAME/kaatupoochi.git)


2. Setup Backend: (make sure backend is running on 3000 port)

Bash
cd backend
npm install
# Create a .env file with your GITHUB_TOKEN and GEMINI_API_KEY
node server.js

3. Setup Frontend:

Bash
cd ../frontend
npm install
npm run dev


Open in browser: http://localhost:3001

