import { AnalysedMap } from "../analyser/AnalysedMap";

export interface GlobalAnalysedMapInterface {
    getAnalysedMap: () => AnalysedMap | undefined
}