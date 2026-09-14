import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "prototype", aiAvailable: false });
});

const aiUnavailable: express.RequestHandler = (_req, res) => {
  res.status(503).json({
    error: "AI 연결은 Career Insight Coach 통합 단계에서 구성됩니다.",
  });
};

app.post("/api/ai/digging-chat", aiUnavailable);
app.post("/api/ai/analyze", aiUnavailable);
app.post("/api/ai/draft-essay", aiUnavailable);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Experience Digging Club prototype running on http://localhost:${PORT}`);
  });
}

startServer();
