import { Effect } from "effect";
import {
    Workflow,
    createDurableWorkflows
} from "@durable-effect/workflow";

const onChainWorkflow = Workflow.make((taskId: string) => 
        Effect.gen(function* () {

            yield* Effect.log(`Processing data for task ${taskId}`);
            
            yield* Workflow.step("MVRV", fetchMVRVIdempotent(taskId));
            
            yield* Workflow.step("NUPL", fetchNUPLIdempotent(taskId));
            
            yield* Workflow.step("Hash Ribbons", fetchHashRibbonsIdempotent(taskId));
        }),
);

const macroWorkflow = Workflow.make((taskId: string) => 
    Effect.gen(function* () {
        yield* Effect.log(`Processing data for task ${taskId}`);

        yield* Workflow.step("Initial Jobless Claims", fetchInitialJoblessClaimsIdempotent(taskId));
    }),
);

const fetchMVRVIdempotent = (taskId: string) =>
    Effect.gen(function* () {
        yield* Effect.log(`Fetching MVRV for task ${taskId}`);

        return {
            d: "2025-12-08",
            unixTs: "1765152000",
            mvrvZscore: "1.1987"
          }
    });

const fetchNUPLIdempotent = (taskId: string) =>
    Effect.gen(function* () {
        yield* Effect.log(`Fetching NUPL for task ${taskId}`);

        return {
            d: "2025-12-08",
            unixTs: "1765152000",
            nupl: "0.37945313477312065"
          }
    });

const fetchHashRibbonsIdempotent = (taskId: string) =>
    Effect.gen(function* () {
        yield* Effect.log(`Fetching Hash Ribbons for task ${taskId}`);

        return {
            d: "2025-12-08",
            unixTs: "1765152000",
            sma_30: 1075552849.05,
            sma_60: 1093192112.75,
            hashribbons: "Down"
        }
    });

const fetchInitialJoblessClaimsIdempotent = (taskId: string) =>
    Effect.gen(function* () {
        yield* Effect.log(`Fetching Initial Jobless Claims for task ${taskId}`);

        return {
            realtime_start: "2025-12-09",
            realtime_end: "2025-12-09",
            date: "2025-11-29",
            value: "191000"
          }
    });

const workflows = {
    onChainWorkflow,
    macroWorkflow,
} as const;

// createDurableWorkflows returns an object with Workflows (the Durable Object class) and WorkflowClient
// We need to destructure to get the class
export const { Workflows } = createDurableWorkflows(workflows);