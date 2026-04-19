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
