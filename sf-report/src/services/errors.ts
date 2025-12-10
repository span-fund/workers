import { Data } from "effect";

export class NetworkError extends Data.TaggedError("NetworkError")<{
    readonly status: number;
    readonly statusText: string;
}> { }

export class FetchError extends Data.TaggedError("FetchError")<{
    readonly status: number;
    readonly statusText: string;
}> { }

export class MVRVFailed extends Data.TaggedError("MVRVFailed")<{
    readonly reason: string;
    readonly taskId?: string;
}> { }

export class NUPLFailed extends Data.TaggedError("NUPLFailed")<{
    readonly reason: string;
    readonly taskId?: string;
}> { }

export class HashRibbonsFailed extends Data.TaggedError("HashRibbonsFailed")<{
    readonly reason: string;
    readonly taskId?: string;
}> { }

export class JsonError extends Data.TaggedError("JsonError")<{}> { }