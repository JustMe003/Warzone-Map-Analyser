import { GraphicalMap } from "../map/GraphicalMap";

export interface GlobalGraphicalMapInterface {
    getGraphicalMap: () => GraphicalMap | undefined
}