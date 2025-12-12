import { Schema } from "effect";

export class MvRv extends Schema.Class<MvRv>("MvRv")({
    d: Schema.String,
    unixTs: Schema.String,
    mvrv: Schema.String,
}){}

export class NUPL extends Schema.Class<NUPL>("NUPL")({
    d: Schema.String,
    unixTs: Schema.String,
    nupl: Schema.String,
}){}

export class HashRibbons extends Schema.Class<HashRibbons>("HashRibbons")({
    d: Schema.String,
    unixTs: Schema.String,
    sma_30: Schema.Number,
    sma_60: Schema.Number,
    hashribbons: Schema.String,
}){}

export class OnChainResult extends Schema.Class<OnChainResult>("OnChainResult")({
    mvrv: MvRv,
    nupl: NUPL,
    hashribbons: HashRibbons,
}){}