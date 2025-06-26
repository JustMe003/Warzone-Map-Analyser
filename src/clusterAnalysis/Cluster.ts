import { ClusterElement } from "./ClusterElement";

/**
 * Cluster class
 */
export class Cluster<T extends ClusterElement> {
    private elements: T[];
    private elementsSum: ClusterElement;
    private clusterId: number;

    private static CLUSTER_COUNTER = 0;

    constructor() {
        this.elements = [];
        this.elementsSum = {
            x: 0,
            y: 0
        };
        this.clusterId = Cluster.CLUSTER_COUNTER;
        Cluster.CLUSTER_COUNTER++;
    }

    /**
     * Adds a new element to the cluster
     * @param e The new element
     */
    public add(e: T) {
        this.elements.push(e);
        this.elementsSum = {
            x: this.elementsSum.x + e.x,
            y: this.elementsSum.y + e.y
        };
    }

    /**
     * Returns the elements in this cluster as an array
     * @returns The elements in this cluster
     */
    public getElements() {
        return this.elements;
    }

    /**
     * Returns the middle point (mean of all coordinates) of this cluster
     * Will return point (-1, -1) if this cluster has no elements 
     * @returns The middle point of this cluster
     */
    public getMiddle(): ClusterElement {
        return {
            x: (this.elementsSum.x / this.elements.length),
            y: (this.elementsSum.y / this.elements.length)
        };
    }

    public getDistance(point: ClusterElement): number {
        const middle = this.getMiddle();
        return Math.sqrt(Math.pow(point.x - middle.x, 2) + Math.pow(point.y - middle.y, 2));
    }

    public getClusterId() {
        return this.clusterId;
    }
}