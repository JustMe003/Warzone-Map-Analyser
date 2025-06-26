import { ClusterElement } from "./ClusterElement";

/**
 * ScatterPoint interface, extends ClusterElement
 */
export interface ScatterPoint extends ClusterElement {
    x: number,
    y: number,
    id: number
}
