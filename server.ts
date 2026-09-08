import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback generator if API key is not yet set in environment
function generateLocalFallback(message: string, context: any = {}): string {
  const name = context?.name || "Investor";
  const currency = context?.currencySymbol || "₹";
  const cash = context?.cash ? Number(context.cash).toLocaleString() : "1,00,000";
  const holdings = context?.holdings || [];
  const riskTier = context?.riskTier || "Moderate";
  const totalVal = context?.portfolioValue ? Number(context.portfolioValue).toLocaleString() : cash;

  const lower = (message || "").toLowerCase();

  if (lower.includes("risk") || lower.includes("portfolio")) {
    return `### 📊 Portfolio Risk & Exposure Synthesis
**Investor Profile:** ${name} (${riskTier} Risk Tier)  
**Total Asset Value:** ${currency}${totalVal} (Available Margin: ${currency}${cash})

#### Current Allocation Breakdown
${holdings.length > 0 ? holdings.map((h: any) => `- **${h.ticker}** (${h.name}): ${h.quantity} units | P&L: ${h.pnl}`).join("\n") : "- *No active open positions. Portfolio is 100% liquid cash.*"}

#### Institutional Risk Observations
1. **Cash Buffer:** You hold **${currency}${cash}** in liquid reserves. This provides substantial dry powder to capitalize on market corrections without forced liquidations.
2. **Diversification Check:** ${holdings.length < 3 ? "Your current asset concentration is concentrated in few positions. Consider spreading exposure across defensive defensive large-caps and broad index ETFs (e.g. NIFTY50 or S&P 500)." : "Your current holdings show cross-sector distribution. Ensure position sizes do not exceed your 20% single-asset ceiling."}
3. **Volatility Tolerance:** As a **${riskTier}** investor, maintaining a 20-30% liquid cash allocation helps protect capital during macro interest rate repricings.`;
  }

  if (lower.includes("tech") || lower.includes("growth") || lower.includes("suggest")) {
    return `### 🚀 Institutional High-Growth Tech Candidates
Evaluating secular growth themes across enterprise AI, semiconductors, and cloud infrastructure:

| Ticker | Company | Catalysts & Strategic Moat | Risk Tier |
| :--- | :--- | :--- | :--- |
| **NVDA** | NVIDIA Corp | Monopolistic data center GPU architecture & CUDA ecosystem | Aggressive |
| **AAPL** | Apple Inc. | Installed base monetization, on-device AI silicon, cash moat | Moderate |
| **MSFT** | Microsoft | Azure AI hyperscale expansion and enterprise copilot enterprise ARR | Moderate |
| **TCS** | Tata Consultancy | Leading global IT integration & massive Indian domestic enterprise spend | Conservative |

#### Tactical Portfolio Allocation Advice
Given your current liquid balance of **${currency}${cash}**, consider dollar-cost averaging into dips rather than single lump-sum execution. High-beta tech names should be paired with trailing stops to safeguard your risk threshold.`;
  }

  if (lower.includes("p/e") || lower.includes("pe ratio")) {
    return `### 💡 Understanding the Price-to-Earnings (P/E) Ratio
The **P/E ratio** measures the price investors are willing to pay today for ₹1 (or $1) of current company earnings.

$$\\text{P/E Ratio} = \\frac{\\text{Market Price Per Share}}{\\text{Earnings Per Share (EPS)}}$$

#### Key Variants
- **Trailing P/E (TTM):** Uses actual reported net earnings over the past 12 months. Objective and historical.
- **Forward P/E:** Based on consensus Wall Street analyst estimates for future 12 months. Forward-looking but subject to guidance revisions.

#### How Institutional Allocators Use It
1. **Value vs. Growth:** A lower P/E (e.g., 12x-18x) often indicates value or mature cash-flow generators (e.g., banking, energy). A higher P/E (30x-60x+) indicates market anticipation of rapid forward revenue acceleration (e.g., SaaS, AI hardware).
2. **Sector Context:** Never compare P/E across different sectors. Compare Apple to Microsoft or Reliance to peers, not software to oil refineries.
3. **The PEG Ratio:** Pair P/E with growth rate ($PEG = P/E \\div \\text{Growth Rate}$) to identify fairly valued high-growth winners.`;
  }

  if (lower.includes("tax") || lower.includes("harvesting")) {
    return `### ⚖️ Tax-Loss Harvesting Strategies
**Tax-loss harvesting** is the practice of selectively selling securities at an unrealized loss to offset taxable capital gains across profitable trades.

#### 4-Step Execution Framework
1. **Identify Underwater Positions:** Review your current holdings table for positions trading below your average execution price.
2. **Harvest the Capital Loss:** Realize the loss before the end of the tax financial year.
3. **Reinvest in Correlated Assets:** Avoid remaining out of the market. Immediately deploy proceeds into an economically equivalent ETF or sector peer to maintain exposure without violating wash-sale rules.
4. **Offset Short & Long-Term Gains:** Net losses directly reduce realized capital gains, shielding your compounding returns.

*Note: Always consult with a licensed tax advisor regarding the wash-sale rule (30-day window) and local jurisdictional capital gains statutes.*`;
  }

  return `### 🌐 Aura Institutional Advisory
Greetings **${name}**. I have reviewed your current holdings and market telemetry.

- **Available Liquidity:** ${currency}${cash}
- **Holdings Count:** ${holdings.length} active positions
- **Risk Tolerance:** ${riskTier}

I am prepared to run deep-dive valuations, balance sheet stress tests, scenario simulations, or technical analysis on any stock or crypto asset. What specific thesis would you like to explore?`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Bulls&Bears API", time: new Date().toISOString() });
  });

  // AI Analyst Aura Chat Endpoint
  app.post("/api/aura/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

      const ai = getGenAI();

      if (!ai) {
        // Safe fallback when GEMINI_API_KEY is not configured
        const fallbackReply = generateLocalFallback(message, context);
        return res.json({
          reply: fallbackReply,
          source: "fallback-no-key",
          notice: "GEMINI_API_KEY not found in environment. Provide key in Settings > Secrets for live cloud AI model."
        });
      }

      const userContext = context || {};
      const holdings = userContext.holdings || [];
      const recentTrades = userContext.recentTrades || [];
      const currencySymbol = userContext.currencySymbol || "₹";

      const holdingsText = holdings.length > 0
        ? holdings.map((h: any) => `  * ${h.ticker} (${h.name}): ${h.quantity} shares/units @ Avg Cost ${currencySymbol}${h.avgBuyPrice} | Current Price: ${currencySymbol}${h.currentPrice} | Unrealized P&L: ${h.pnl}`).join("\n")
        : "  * (No open positions. Portfolio is currently 100% in liquid cash reserve.)";

      const tradesText = recentTrades.length > 0
        ? recentTrades.slice(0, 8).map((t: any) => `  * ${t.type} ${t.quantity} ${t.ticker} (${t.name}) @ ${currencySymbol}${t.executedPrice} on ${t.timestamp} [P&L: ${t.realizedPnL !== null && t.realizedPnL !== undefined ? t.realizedPnL : "N/A"}]`).join("\n")
        : "  * (No historical trades executed yet)";

      const contextTelemetry = `
[LIVE INVESTOR PORTFOLIO TELEMETRY]
- Investor Name: ${userContext.name || "Retail Guest"}
- Account Persona: ${userContext.persona || "Aggressive Growth Investor"}
- Risk Appetite Tier: ${userContext.riskTier || "Moderate"}
- Target Maximum Equity Exposure: ${userContext.maxEquityExposure || "60%"}
- Experience Level: ${userContext.experience || "Intermediate"}
- Horizon: ${userContext.horizon || "Long-term compounding"}
- Base Currency: ${userContext.currency || "INR"} (${currencySymbol})
- Liquid Cash Balance: ${currencySymbol}${Number(userContext.cash || 0).toLocaleString()}
- Total Portfolio Valuation: ${currencySymbol}${Number(userContext.portfolioValue || 0).toLocaleString()}
- Active Portfolio Holdings (${holdings.length}):
${holdingsText}
- Recent Trade History:
${tradesText}
`;

      const systemInstruction = `You are Aura, an elite institutional financial analyst and portfolio advisor for the Bulls&Bears financial terminal.
Always reference the user's actual portfolio holdings, available cash balance, and risk profile when giving guidance.
Use clean markdown for tables, bold keys, and bullet points. Keep advice objective, analytical, and realistic.
Emphasize risk management, position sizing, diversification, and macroeconomic fundamentals.
Never recommend reckless speculative trades that violate the user's stated risk tier.`;

      // Build contents array supporting conversation history
      const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        // Take up to last 8 turns for context continuity
        const turns = history.slice(-8);
        for (const item of turns) {
          if (item && item.role && item.text) {
            formattedContents.push({
              role: item.role === "assistant" || item.role === "model" ? "model" : "user",
              parts: [{ text: String(item.text) }]
            });
          }
        }
      }

      const promptWithTelemetry = `${contextTelemetry}\n\n[USER INQUIRY]\n${message}`;
      formattedContents.push({
        role: "user",
        parts: [{ text: promptWithTelemetry }]
      });

      // Call Gemini API with gemini-3.8-flash
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.65,
          },
        });
      } catch (modelErr: any) {
        console.warn("Retrying with gemini-3.6-flash:", modelErr?.message);
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.65,
          },
        });
      }

      const replyText = response.text || "I have analyzed your portfolio. How else can I assist your financial allocation today?";
      return res.json({ reply: replyText, source: "gemini" });
    } catch (err: any) {
      console.error("Gemini invocation failed, falling back to local analyst synthesis:", err?.message || err);
      const fallbackReply = generateLocalFallback(req.body?.message, req.body?.context);
      return res.json({
        reply: fallbackReply,
        source: "fallback-error",
        errorDetail: err?.message || "Model request error"
      });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bulls&Bears server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
