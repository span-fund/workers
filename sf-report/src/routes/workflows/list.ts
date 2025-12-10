import { Effect } from "effect";
import { CloudflareEnv, HonoCtx, type RouteEffect } from "../../adapter";
import { WorkflowClient } from "../../workflows/sentiment";

/**
 * GET /workflows - List available workflows
 */
export const getWorkflows: RouteEffect<Response> = Effect.gen(function* () {
    const c = yield* HonoCtx;
    return c.json({
      workflows: {
        sentiment: {
            onChain: {
                description: "On chain workflow",
                endpoints: {
                    "GET /workflows/sentiment/onchain?taskId=xxx": "Start on chain workflow",
                    "GET /workflows/:id/status": "Get workflow status",
                },
            },
            macro: {
                description: "Macro workflow",
                endpoints: {
                    "GET /workflows/sentiment/macro?taskId=xxx": "Start macro workflow",
                    "GET /workflows/:id/status": "Get workflow status",
                },
            },
        },
      }
    });
  });

  /**
 * GET /workflows/:id/status - Get workflow status
 */
export const getWorkflowStatus: RouteEffect<Response> = Effect.gen(function* () {
    const c = yield* HonoCtx;
    const env = yield* CloudflareEnv;
  
    const instanceId = c.req.param("id");
    const client = WorkflowClient.fromBinding(env.WORKFLOWS);
  
    const status = yield* client.status(instanceId);
  
    return c.json({
      instanceId,
      status,
    });
  });