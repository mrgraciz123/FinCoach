import express from "express";
import { createServer as createViteServer } from "vite";
import YahooFinance from 'yahoo-finance2';
import path from 'path';

const yahooFinance = new YahooFinance();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for fetching stock data
  app.get("/api/stock/:symbol", async (req, res) => {
    try {
      let symbol = req.params.symbol.toUpperCase().trim();
      
      // Auto-append .NS for Indian stocks if no suffix is provided and it's not an index
      if (!symbol.includes('.') && !symbol.startsWith('^')) {
        symbol += '.NS';
      }
      
      const quote = await yahooFinance.quote(symbol);
      
      const period1 = new Date();
      period1.setMonth(period1.getMonth() - 1); // 1 month ago
      
      const history = await yahooFinance.historical(symbol, {
        period1: period1,
        interval: '1d'
      });
      
      res.json({ quote, history });
    } catch (error: any) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock data. Please check the symbol." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
