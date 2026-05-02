# AI Personalized Learning — Backend Setup

A full-stack CS learning platform with AI-powered quizzes, sorting visualizations, data structure demos, and personalized roadmaps.

## 🗂 Project Structure

```
ai-personalized-learning/
├── server.js          ← Express backend (API proxy)
├── package.json
├── .env.example       ← Copy to .env and add your key
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your API key
```bash
cp .env.example .env
```
Then edit `.env` and replace `your_api_key_here` with your real Anthropic API key from [console.anthropic.com](https://console.anthropic.com/).

### 3. Start the server
```bash
npm start
```

Open **http://localhost:3000** in your browser.

For development with auto-reload:
```bash
npm run dev
```

## 🔑 How the Backend Works

The frontend (`script.js`) calls `/api/ai` on your local server instead of hitting Anthropic directly. The backend (`server.js`) securely forwards the request to Anthropic using the API key stored in your `.env` — it never reaches the browser.

```
Browser → POST /api/ai → server.js → Anthropic API
                                           ↓
Browser ← JSON response ← server.js ←────┘
```

## 🌐 Deploying to Production

### Railway / Render / Fly.io
1. Push this folder to a GitHub repo
2. Connect to your chosen platform
3. Set `ANTHROPIC_API_KEY` as an environment variable in the platform's dashboard
4. Deploy — the platform will run `npm start` automatically

### Heroku
```bash
heroku create
heroku config:set ANTHROPIC_API_KEY=your_key_here
git push heroku main
```

## ⚠️ Security Notes
- Never commit your `.env` file (it's gitignored by default)
- The `.env.example` file is safe to commit — it has no real key
- Your API key stays on the server and is never exposed to the browser
