import { Effect, Data } from "effect";
import {
    Workflow,
    WorkflowContext,
    StepContext,
    createDurableWorkflows,
} from "@durable-effect/workflow";
import { getHashRibbons, getMvRv, getNUPL } from "../services/sentiment";
import { HashRibbonsFailed, MVRVFailed, NUPLFailed } from "../services/errors";

// =============================================================================
// Fetch On Chain Workflow
// =============================================================================

const fetchOnChainWorkflow = Workflow.make((taskId: string) =>
    Effect.gen(function* () {
        const workflowCtx = yield* WorkflowContext;

        yield* Effect.log(`Processing workflow ${workflowCtx.workflowName}, with id ${workflowCtx.workflowId}`);

        const mvrv = yield* Workflow.step("MVRV",
            fetchMVRVIdempotent(taskId)
                .pipe(
                    Effect.catchTag("FetchError", (error) =>
                        Effect.fail(
                            new MVRVFailed({ reason: `Status Code: ${error.status}`, taskId: taskId }))
                    ),
                    Workflow.retry({
                        maxAttempts: 3,
                        delay: "2 seconds",
                    })
                ));

        yield* Workflow.step("NUPL",
            fetchNUPLIdempotent(taskId).pipe(
                Effect.catchTag("FetchError", (error) =>
                    Effect.fail(
                        new NUPLFailed({ reason: `Status Code: ${error.status}`, taskId: taskId }))
                )
            )
        );

        yield* Workflow.step("Hash Ribbons",
            fetchHashRibbonsIdempotent(taskId).pipe(
                Effect.catchTag("FetchError", (error) =>
                    Effect.fail(
                        new HashRibbonsFailed({ reason: `Status Code: ${error.status}`, taskId: taskId }))
                )
            )
        );

        yield* workflowCtx.setMeta("completed", Date.now());
    })
        // .pipe(
        //     Effect.catchAll((error) =>
        //         Effect.gen(function* () {
        //             const ctx = yield* WorkflowContext;
        //             yield* ctx.setMeta("error", String(error));
        //             yield* Effect.logError("Workflow failed", error);
        //         })
        //     )),
);

const fetchMVRVIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching data for step ${stepCtx.stepName}`);

        const mvrv = yield* getMvRv()

        yield* Effect.log(`MVRVw: ${mvrv}`);

        yield* stepCtx.setMeta("completed", Date.now());

        return mvrv;
    });

const fetchNUPLIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching data for step ${stepCtx.stepName}`);

        const nupl = yield* getNUPL()

        yield* Effect.log(`NUPLw: ${nupl}`);

        yield* stepCtx.setMeta("completed", Date.now());

        return nupl;
    });

const fetchHashRibbonsIdempotent = (taskId: string) =>
    Effect.gen(function* () {

        const stepCtx = yield* StepContext;

        yield* Effect.log(`Fetching Hash Ribbons for step ${stepCtx.stepName}`);

        const hashribbons = yield* getHashRibbons()

        yield* Effect.log(`Hash Ribbonsw: ${hashribbons}`);

        yield* stepCtx.setMeta("completed", Date.now());

        return hashribbons;
    });

// =============================================================================
// Fetch Macro Workflow
// =============================================================================

const fetchMacroWorkflow = Workflow.make((taskId: string) =>
    Effect.gen(function* () {
        const workflowCtx = yield* WorkflowContext;

        yield* Effect.log(`Processing workflow ${workflowCtx.workflowName}, with id ${workflowCtx.workflowId}`);

        yield* Workflow.step("Initial Jobless Claims", fetchInitialJoblessClaimsIdempotent(taskId));

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