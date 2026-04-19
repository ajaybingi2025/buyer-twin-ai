# BuyerTwin AI

BuyerTwin AI is an AI-powered decision copilot for real estate agents. It helps agents understand buyer intent, prioritize serious leads, recommend relevant listings, and generate personalized outreach that improves conversion from existing buyer pipelines.

## Overview

Traditional CRM tools store buyer data, but they do not explain what a buyer actually cares about, how ready they are, or what the agent should do next.

BuyerTwin AI solves that gap by combining:
- buyer profile information
- behavioral signals such as searches, clicks, saves, and inquiries
- ML-based scoring and ranking
- AI-generated summaries and outreach

The result is a workflow that helps agents:
- prioritize serious buyers
- recommend the right homes faster
- personalize communication at scale
- improve response quality and tour conversion

## Key Features

- BuyerTwin profile generation for each lead
- Buyer scoring and prioritization
- Listing recommendation and ranking
- Buyer readiness estimation
- Personalized outreach generation
- Agent-focused workflow views

## How It Works

1. Buyer profile data and activity signals are collected.
2. A BuyerTwin is created to represent buyer preferences, behavior, and intent.
3. Buyers and listings are scored using ML-based logic.
4. The system generates explanations and personalized outreach.
5. Agents use the ranked insights to take the next best action.

## Project Architecture

### Frontend
The frontend provides the buyer and agent experience, including dashboards, views, and recommendation screens.

### Backend
The backend handles API orchestration, structured data flow, routing, and persistence for buyer, listing, and outreach data.

### AI / ML Layer
The AI layer powers BuyerTwin modeling, ranking, recommendation logic, and personalized communication generation.

## Tech Stack

- React
- Vite
- JavaScript
- HTML
- CSS
- Python
- FastAPI
- PostgreSQL
- XGBoost
- Groq API

## Repository Structure

```text
BuyerTwin/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   ├── db/
│   ├── model/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── requirements.txt
└── README.md
```

## Use Case

BuyerTwin AI is designed for real estate agents and teams who want to:

- identify high-intent buyers faster
- reduce time spent on low-quality leads
- match buyers with better-fit listings
- improve follow-up quality with AI-generated outreach

## Core Workflow

1. Agent logs in
2. Buyer information is loaded
3. Buyer activity is analyzed
4. BuyerTwin is generated
5. Listings are ranked by fit
6. Outreach is generated
7. Agent receives a next-best-action recommendation

## Business Value

BuyerTwin AI increases the value of existing leads without requiring agents to purchase more lead volume.

### Customer pain

- Time wasted on low-intent leads
- Generic follow-up reduces response
- High-intent buyers get missed in busy pipelines

### Value created

- Better lead prioritization
- Faster, more relevant outreach
- Higher tour-booking potential

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Narahari917/BuyerTwin.git
cd BuyerTwin
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run the backend server using your FastAPI entry point.

Example:

```bash
uvicorn app.main:app --reload
```

> Update the command above if your FastAPI app entry file is different.

## Environment Variables

Create a `.env` file in the backend directory and configure the required values.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/buyertwin
GROQ_API_KEY=your_groq_api_key
```

## Future Improvements

- deeper CRM integration
- real-time event ingestion
- stronger recommendation explainability
- buyer readiness tracking over time
- brokerage and team analytics
- tighter workflow integration with real estate platforms

## Team

- Narahari Kommi
- Ajay Bingi
- Anvitha Nagireddy

## Elevator Pitch

**BuyerTwin AI turns buyer behavior into ranked insights, better home matches, and personalized agent outreach.**

## License

This project was built as part of a hackathon prototype. Add your preferred license here.
