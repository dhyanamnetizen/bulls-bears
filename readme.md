# Bulls&Bears — AI-Powered Portfolio & Market Terminal

> An institutional-grade financial portfolio tracker and stock market simulator built for everyday investors, featuring real-time paper trading and an AI financial analyst.

---

## Project Overview

**Bulls&Bears** is a comprehensive web-based financial terminal designed to bridge the gap between complex market analytics and retail investors. The application allows users to monitor live market watchlists, execute virtual paper trades, analyze risk-return metrics through interactive SVG charts, and consult an intelligent AI financial analyst named **Aura** powered by Google AI Studio. 

The application is engineered as a single-file, zero-setup progressive web app that operates entirely client-side using browser storage.

---

## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+) with modern CSS Flexbox/Grid and responsive layouts.
* **Storage & Persistence:** Browser `localStorage` acting as a secure local ledger for user profiles, watchlists, holdings, and transaction histories.
* **AI Integration:** Google AI Studio (Gemini Flash model via runtime environment) for context-aware financial advisory.
* **Visualization:** Custom SVG-based line charts and dynamic progress bars for portfolio tracking and asset allocation.
* **Deployment:** Hosted and deployed continuously via Vercel.

---

## Features

1. **Dual-View Architecture:** Features a high-converting SaaS landing page detailing platform capabilities and an immersive 5-tab trading terminal shell.
2. **Investor Onboarding & Authentication:** Local credential management coupled with a 4-step investor onboarding wizard that calculates custom risk profiles and initial virtual capital.
3. **Multi-Asset Watchlist & Market Feed:** Live-mock tracking across global equities, crypto assets, and major market indices with interactive filtering and search.
4. **Virtual Paper Trading Simulator:** Fully functional order execution engine supporting market/limit orders, live P&L tracking, cash balance management, and detailed trade histories.
5. **Analytics Dashboard:** Visual representation of portfolio performance, asset class breakdown (Equities vs. Crypto vs. Cash), and risk exposure gauges.
6. **Aura AI Financial Analyst:** Conversational AI assistant with full context-awareness of the user's active portfolio holdings, risk appetite, and transaction logs.

---

## Setup & Installation Instructions

No terminal setups, Node modules, or local environment variables are required.

1. Clone or download this GitHub repository.
2. Ensure the main file is named `index.html`.
3. Open `index.html` directly in any modern web browser (Google Chrome recommended) or deploy instantly by importing the repository into Vercel.

---

## AI Assistance & Disclosure

* **Tools Used:** Google AI Studio (Gemini 2.0 Flash) and automated scaffolding templates.
* **How AI Was Used:** AI was utilized to rapidly prototype UI layouts, structure the vanilla JavaScript state management logic for `localStorage`, and draft contextual system prompts for the Aura financial analyst.
* **Human Contribution:** The core architecture plan, risk-calculation formulas, UI styling tweaks, debugging of state synchronization bugs, and thorough testing of edge cases were personally reviewed, modified, and validated by the candidate.

---

## Known Limitations

* **Mock Data Feeds:** Stock and crypto prices are simulated mock feeds rather than real-time exchange WebSocket streams.
* **Client-Side Storage:** Because data persists exclusively in browser `localStorage`, clearing browser cache or switching devices will reset user portfolios and chat histories.
* **Limited Export Formats:** Advanced reporting features rely on browser print/PDF dialogs and basic JSON/CSV dumps rather than cloud-synced server reports.
