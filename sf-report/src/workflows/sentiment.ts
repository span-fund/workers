import { Effect, Data, Schema } from "effect";
import {
    Workflow,
    WorkflowContext,
    StepContext,
    createDurableWorkflows,
    Backoff,
} from "@durable-effect/workflow";
import { getHashRibbons, getMvRv, getNUPL } from "../services/sentiment";
import { FetchError } from "../services/errors";
import { OnChainResult } from "../services/schemas";

// =============================================================================
// Fetch On Chain Workflow
// =============================================================================

const fetchOnChainWorkflow = Workflow.make((taskId: string) =>
    Effect.gen(function* () {
        const workflowCtx = yield* WorkflowContext;

        yield* Effect.log(`Processing workflow ${workflowCtx.workflowName}, with id ${workflowCtx.workflowId}`);

        const mvrv = yield* Workflow.step({
            name: "MVRV",
            execute: fetchMVRVIdempotent(taskId),
            retry: {
                maxAttempts: 2,
                delay: "60 seconds",
                isRetryable: (error) => error instanceof FetchError,
            }
        });

        yield* Workflow.sleep("10 seconds");

        const nupl = yield* Workflow.step({
            name: "NUPL",
            execute: fetchNUPLIdempotent(taskId),
            retry: {
                maxAttempts: 2,
                delay: "60 seconds",
                isRetryable: (error) => error instanceof FetchError,
            }
        });

        yield* Workflow.sleep("10 seconds");

        const hashribbons = yield* Workflow.step({
            name: "Hash Ribbons",
            execute: fetchHashRibbonsIdempotent(taskId),
            retry: {
                maxAttempts: 2,
                delay: "60 seconds",
                isRetryable: (error) => error instanceof FetchError,
            }
        });

        const result = yield* Schema.decodeUnknown(OnChainResult)({
            mvrv,
            nupl,
            hashribbons,
        });

        return result;
    })
);

const fetchMVRVIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching data for step ${stepCtx.stepName}`);

        return yield* getMvRv();
    });

const fetchNUPLIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching data for step ${stepCtx.stepName}`);

        return yield* getNUPL();
    });

const fetchHashRibbonsIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching Hash Ribbons for step ${stepCtx.stepName}`);

        return yield* getHashRibbons();
    });

// =============================================================================
// Fetch Macro Workflow
// =============================================================================

const fetchMacroWorkflow = Workflow.make((taskId: string) =>
    Effect.gen(function* () {
        const workflowCtx = yield* WorkflowContext;

        yield* Effect.log(`Processing workflow ${workflowCtx.workflowName}, with id ${workflowCtx.workflowId}`);

        yield* Workflow.step({
            name: "Initial Jobless Claims",
            execute: fetchInitialJoblessClaimsIdempotent(taskId)
        });

        yield* workflowCtx.setMeta("completed", Date.now());
    }),
);

const fetchInitialJoblessClaimsIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching Initial Jobless Claims for step ${stepCtx.stepName}`);

        yield* stepCtx.setMeta("completed", Date.now());

        return {
            realtime_start: "2025-12-09",
            realtime_end: "2025-12-09",
            date: "2025-11-29",
            value: "191000"
        }
    });

const workflows = {
    fetchOnChain: fetchOnChainWorkflow,
    fetchMacro: fetchMacroWorkflow,
} as const;

export const { Workflows, WorkflowClient } = createDurableWorkflows(workflows);