import { Hono } from "hono";
import { effectHandler } from "./adapter";
import { Workflows } from "./workflows/sentiment";
import { getHealth, getHealthReady } from "./routes/health";
import { getWorkflows, getWorkflowStatus } from "./routes/workflows/list";
import { getMacro, getOnChain } from "./routes/workflows/sentiment";

export { Workflows };

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.json({
    name: "Effect Worker",
    version: "0.0.0",
    description: "Durable Effect Workflow Example with Hono + Effect",
  }),
);

// Health routes
app.get("/health", effectHandler(getHealth));
app.get("/health/ready", effectHandler(getHealthReady));

// Workflow routes
app.get("/workflows", effectHandler(getWorkflows));
app.get("/workflows/sentiment/onchain", effectHandler(getOnChain));
app.get("/workflows/sentiment/macro", effectHandler(getMacro));
app.get("/workflows/:id/status", effectHandler(getWorkflowStatus));

// 404 handler
app.notFound((c) => c.json({ error: "Not Found" }, 404));

// Error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// =============================================================================
// Export Worker
// =============================================================================

export default app;