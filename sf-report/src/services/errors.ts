import { Data } from "effect";

export class NetworkError extends Data.TaggedError("NetworkError")<{
    readonly status: number;
    readonly statusText: string;
}> { }

export class FetchError extends Data.TaggedError("FetchError")<{
    readonly status: number;
    readonly statusText: string;
}> { }

export class JsonError extends Data.TaggedError("JsonError")<{}> { }