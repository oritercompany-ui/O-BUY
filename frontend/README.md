# O-BUY

### AI-Powered Agentic Commerce

**O-BUY transforms natural-language shopping intent into a budget-aware purchase plan and PayPal-powered checkout workflow.**

Instead of simply recommending products, O-BUY acts as a shopping agent that understands what the user wants, evaluates the request against a budget, optimizes the purchase plan, and prepares the transaction through PayPal.

---

## Overview

Online shopping often requires users to move between multiple steps:

**Search → Compare → Calculate → Optimize → Checkout**

O-BUY brings these steps into a single agentic commerce experience.

A user can simply describe what they want and define their budget:

> *"Build me a professional desk setup under $500 with a monitor and keyboard."*

O-BUY then turns that request into a structured purchase workflow.

---

## How O-BUY Works

```text
┌─────────────────────┐
│   Natural Language  │
│       Intent        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   AI Shopping       │
│      Agent          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Budget Guard     │
│  Validate Spending  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Product Optimization│
│   Improve Selection │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Autonomy Control   │
│ User Approval Level │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Purchase Plan     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   PayPal Checkout   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Payment Capture &   │
│     Confirmation    │
└─────────────────────┘
```

---

## Why O-BUY?

Most AI shopping experiences stop at recommendations.

O-BUY focuses on what happens **after the recommendation**.

The agent helps transform:

**"I want to buy something."**

into:

**"Here is the optimized purchase plan, it fits your budget, and it is ready for checkout."**

This creates a more complete **agentic commerce** workflow where AI assists with the journey from intent to transaction.

---

## Core Capabilities

### 🤖 AI Shopping Agent

Understands natural-language shopping requests and converts them into structured purchase plans.

### 💰 Budget Guard

Evaluates the proposed purchase against the user's spending limit and identifies whether the plan fits within the available budget.

### ⚡ Purchase Optimization

When the initial selection does not fit the budget, O-BUY can optimize the product selection while maintaining the user's shopping intent.

### 🎛️ Autonomy Control

Users can control how much autonomy the agent receives during the purchase workflow.

This keeps the user in control instead of treating AI automation as an all-or-nothing decision.

### 🛒 Purchase Preparation

O-BUY converts the AI-generated recommendation into a structured checkout-ready purchase plan.

### 💳 PayPal Integration

PayPal is integrated directly into the transaction workflow, allowing the purchase plan to move from AI decision-making into an actual payment flow.

### 📱 Responsive Experience

The dashboard is designed to work across desktop, tablet, and mobile screens.

---

## Technology

### Frontend

- React
- TypeScript
- Vite
- Lucide React

### Backend

- Node.js
- Express
- Google Gemini
- PayPal Server SDK
- CORS
- dotenv

### Architecture

```text
                    O-BUY
                      │
          ┌───────────┴───────────┐
          │                       │
     React Frontend          Express API
          │                       │
          │              ┌────────┼────────┐
          │              │        │        │
          │             AI     Budget    PayPal
          │           Agent     Logic     API
          │              │        │        │
          └──────────────┴────────┴────────┘
                           │
                     Purchase Flow
```

---

## AI + Deterministic Logic

O-BUY combines generative AI with deterministic business logic.

The AI handles natural-language understanding and shopping intent.

Deterministic backend services handle important commerce constraints such as:

- Budget validation
- Remaining budget calculation
- Product optimization
- Checkout preparation
- PayPal order creation
- Payment capture

This separation helps prevent the AI from being solely responsible for transaction-critical calculations.

---

## PayPal Integration

PayPal is not used as a standalone payment button.

It is part of the complete O-BUY purchase workflow:

```text
AI Plan
   ↓
Budget Validation
   ↓
Purchase Preparation
   ↓
PayPal Order
   ↓
User Approval
   ↓
Payment Capture
   ↓
Purchase Confirmation
```

For development and testing, O-BUY uses the PayPal Sandbox environment.

---

## Project Structure

```text
O-BUY/
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Google Gemini API key
- PayPal Developer account
- PayPal Sandbox credentials

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/O-BUY.git
cd O-BUY
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file using the environment variables required by the backend:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox
```

Then start the API:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Environment Variables

Secrets must never be committed to GitHub.

The following values are configured through environment variables:

```text
GEMINI_API_KEY
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT
FRONTEND_URL
PORT
```

The repository intentionally excludes `.env` files.

---

## Security

O-BUY does not store API credentials in source control.

For production deployment:

- Store secrets using the hosting provider's environment variables.
- Use PayPal Sandbox credentials during development.
- Never expose `PAYPAL_CLIENT_SECRET` to the frontend.
- Never commit `.env` files.

---

## Hackathon Focus

O-BUY was built around the concept of **agentic commerce**.

The central idea is simple:

> **Give AI an intent and a budget, then let it turn that intent into an actionable purchase workflow while keeping the user in control.**

The project explores how AI can move beyond product recommendations and participate meaningfully in the commerce journey.

---

## Future Direction

Potential future capabilities include:

- Multi-store product discovery
- Real-time price comparison
- Persistent shopping preferences
- Smarter product substitution
- Merchant integrations
- More granular agent permissions
- Automated recurring purchases
- Expanded payment and fulfillment workflows

---

## License

This project is licensed under the **MIT License**.

---

### Built with

**React · TypeScript · Node.js · Express · Google Gemini · PayPal**

**O-BUY — From shopping intent to action.**