export class Vertex<T extends Vertex<T>> {
	protected id: number;
	protected name: string;
	protected edges: T[];
	protected xCoord: number;
	protected yCoord: number;

	constructor(id: number, name: string, xCoord: number = 0, yCoord: number = 0, edges: T[] = []) {
		this.id = id;
		this.name = name;
		this.edges = edges;
		this.xCoord = xCoord;
		this.yCoord = yCoord;
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public getEdges() {
		return this.edges;
	}

	public getXCoord() {
		return this.xCoord;
	}

	public getYCoord() {
		return this.yCoord;
	}

	public addEdge(v: T) {
		this.edges.push(v);
	}

	public isConnectedToVertexId(id: number) {
		this.edges.forEach(v => {
			if (v.getId() == id) return true;
		});
		return false;
	}

	public isConnectedToVertex(v: T) {
		this.edges.forEach(v2 => {
			if (v == v2) return true;
		})
		return false;
	}
}