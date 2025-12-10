import { Effect } from "effect";
import { CloudflareEnv, HonoCtx, type RouteEffect } from "../../adapter";
import { WorkflowClient } from "../../workflows/sentiment";

// =============================================================================
// Get On Chain Workflow
// =============================================================================

export const getOnChain: RouteEffect<Response> = Effect.gen(function* () {
    const c = yield* HonoCtx;
    const env = yield* CloudflareEnv;
  
    const taskId = c.req.query("taskId") ?? `task-${Date.now()}`;
    const client = WorkflowClient.fromBinding(env.WORKFLOWS);
    
    const { id } = yield* client.runAsync({
      workflow: "fetchOnChain",
      input: taskId,
      execution: { id: taskId },
    });

    const status = yield* client.status(taskId);

    yield* Effect.log(`Status: ${status}`);
  
    return c.json({
      success: status,
      workflowId: id,
      taskId,
    });
  });

// =============================================================================
// Get Macro Workflow
// =============================================================================

  export const getMacro: RouteEffect<Response> = Effect.gen(function* () {
    const c = yield* HonoCtx;
    const env = yield* CloudflareEnv;
  
    const taskId = c.req.query("taskId") ?? `task-${Date.now()}`;
    const client = WorkflowClient.fromBinding(env.WORKFLOWS);
    
    const { id } = yield* client.runAsync({
      workflow: "fetchMacro",
      input: taskId,
      execution: { id: taskId },
    });
  
    return c.json({
      success: true,
      workflowId: id,
      taskId,
    });
  });