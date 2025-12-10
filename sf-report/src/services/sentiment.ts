import { Schema, Effect } from "effect";
import { FetchError, JsonError, NetworkError } from "./errors";
import { HashRibbons, MvRv, NUPL } from "./schemas";

export const getMvRv = () => Effect.gen(function* () {

    const response = yield* Effect.tryPromise({
        try: () => fetch("https://bitcoin-data.com/v1/mvrv/last", {
            headers: {
                "Accept": "application/json"
            }
        }),
        catch: (error) => new NetworkError({ status: 500, statusText: String(error) })
    });

    yield* Effect.log(`Response: ${response.status}, ${response.ok}`);

    const okResponse = yield* Effect.succeed(response).pipe(
        Effect.filterOrFail(
            (r) => r.ok,
            () => new FetchError({
                status: response.status,
                statusText: response.statusText
            })
        )
    );

    const json = yield* Effect.tryPromise({
        try: () => okResponse.json(),
        catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(MvRv)(json);
});

export const getNUPL = () => Effect.gen(function* () {

    const response = yield* Effect.tryPromise({
        try: () => fetch("https://bitcoin-data.com/v1/nupl/last", {
            headers: {
                "Accept": "application/json"
            }
        }),
        catch: (error) => new NetworkError({ status: 500, statusText: String(error) })
    });

    yield* Effect.log(`Response: ${response.status}, ${response.ok}`);

    const okResponse = yield* Effect.succeed(response).pipe(
        Effect.filterOrFail(
            (r) => r.ok,
            () => new FetchError({
                status: response.status,
                statusText: response.statusText
            })
        )
    );

    const json = yield* Effect.tryPromise({
        try: () => okResponse.json(),
        catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(NUPL)(json);
});

export const getHashRibbons = () => Effect.gen(function* () {

    const response = yield* Effect.tryPromise({
        try: () => fetch("https://bitcoin-data.com/v1/hashribbons/last", {
            headers: {
                "Accept": "application/json"
            }
        }),
        catch: (error) => new NetworkError({ status: 500, statusText: String(error) })
    });

    yield* Effect.log(`Response: ${response.status}, ${response.ok}`);

    const okResponse = yield* Effect.succeed(response).pipe(
        Effect.filterOrFail(
            (r) => r.ok,
            () => new FetchError({
                status: response.status,
                statusText: response.statusText
            })
        )
    );

    const json = yield* Effect.tryPromise({
        try: () => okResponse.json(),
        catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(HashRibbons)(json);
});