import { Vertex } from "./Vertice";

export class Graph<T extends Vertex<T>> {
	protected vertices: Map<number, T>;
	protected isConnected: boolean | undefined;

	constructor(vertices: Map<number, T> = new Map()) {
		this.vertices = vertices;
		this.updateIsConnected();
	}

	public updateIsConnected() {
		if (this.vertices.size > 0) {
			// We pick a arbitrary vertice
			const first = this.vertices.values().next().value;
			
			if (first == undefined) throw new Error("Size of graph is not 0, but could not get first element of the map");
			
			// If the graph is connected, we can reach all vertices from any arbitrarely chosen vertice with some path
			const set = new Set<number>([first.getId()]);
			let nextList = [first];
			// We stop iterating once we don't have any new vertices left, or when we have seen all vertices
			while (nextList.length > 0 && set.size != this.vertices.size) {
				const current = nextList.pop();
				if (current == undefined) throw new Error("List was not empty before entering the loop, but removing the last element gave undefined");
				current.getEdges().forEach(v => {
					const verticeId = v.getId();
					if (!set.has(verticeId) && this.vertices.has(verticeId)) {
						set.add(verticeId);
						nextList.push(v);
					}
				});
			}
			this.isConnected = set.size == this.vertices.size;
		} else {
			// An empty graph is by default always connected
			this.isConnected = true;
		}
	}

	public addVertex(v: T) {
		if (this.vertices.get(v.getId())) {
			throw new Error("There already exists an vertice with id " + v.getId().toString());
		}
		this.vertices.set(v.getId(), v);
		this.isConnected = undefined;
	}

	public getAllVertices() {
		return this.vertices;
	}

	public getVertex(id: number) {
		const v = this.vertices.get(id);
		if (v) return v;
		throw new Error("There does not exists a vertice with id " + id);
	}

	public getIsConnected() {
		return this.isConnected;
	}
}