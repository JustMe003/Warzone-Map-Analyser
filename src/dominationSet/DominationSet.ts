import { Vertex } from "../graph/Vertice";

/**
 * DominationSet class
 */
export class DominationSet<T extends Vertex<T>> {
    private vertices: T[];

    constructor(vertices: T[] = []) {
        this.vertices = vertices;
    }

    /**
     * Sets the vertices of this domination set
     * @param vertices The vertices of this domination set
     */
    protected setVertices(vertices: T[]) {
        this.vertices = vertices;
    }

    /**
     * Returns the vertices of this domination set
     * @returns The vertices of this domination set
     */
    public getVertices() {
        return this.vertices;
    }
}