# FutureScope — FAQ

## What is FutureScope?

FutureScope is an AI-powered prediction timeline app. You enter a hypothetical world event — like a peace treaty, a corporate acquisition, or a technological breakthrough — and the AI generates a detailed timeline of cascading consequences stretching into the future, along with data charts visualizing projected trends.

## Core Features

### Prediction Timeline
Enter any "what if" scenario and get 3–30 timeline entries showing how events could unfold. Each entry includes a title, description, confidence score, category, and sentiment indicator. Entries alternate on a visual timeline with animated transitions.

### Data Charts
Each prediction includes 2–4 auto-generated charts (line, area, or bar) that visualize key trends related to the event — things like GDP impact, approval ratings, market projections, or population shifts.

### Confidence Scoring
Every timeline entry has an individual confidence score (1–100%), and an overall confidence gauge summarizes how likely the entire prediction trajectory is.

### Configurable Time Horizon
Choose how far into the future to predict: 1, 3, 5, 10, 15, 25, or 50 years. The AI scales its timeline entries to fit the selected window.

### Adjustable Steps
Control how many timeline entries to generate (3–30, default 15) for more or less granular predictions.

### Category Tagging
Each prediction is categorized as political, economic, social, technological, environmental, or military — color-coded with distinct icons for quick scanning.

### Light & Dark Mode
Automatically follows your system preference. No toggle needed.

### Local API Key Storage
Your Anthropic API key is stored in your browser's localStorage. It is sent directly to the Anthropic API and never touches a server.

## How does it work?

FutureScope sends your event prompt to Claude (via the Anthropic API) with instructions to act as a geopolitical and technological futurist analyst. The AI returns structured JSON containing the timeline, charts, and confidence scores, which the app renders into the visual timeline and chart components.

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** (v4, CSS-based config)
- **Anthropic AI SDK** (Claude Sonnet)
- **Recharts** (data visualization)
- **Lucide React** (icons)

## Is this financial or political advice?

No. Predictions are AI-generated speculation for entertainment and educational purposes only.
