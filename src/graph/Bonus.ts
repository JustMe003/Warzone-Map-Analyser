import { Graph } from "./Graph";
import { Territory } from "./Territory";
import { Vertex } from "./Vertice";

export class Bonus<T extends Territory<T>> extends Graph<T> {
	protected id: number;
	protected value: number;
	protected name: string;

	constructor(id: number, value: number, name: string, vertices: Map<number, T> = new Map()) {
		super(vertices);
		this.id = id;
		this.value = value;
		this.name = name;
	}

	public getId() {
		return this.id;
	}

	public getValue() {
		return this.value;
	}

	public getName() {
		return this.name;
	}

	public overrideBonusValue(newValue: number) {
		this.value = newValue;
	}

	public vertexInBonus(id: number) {
		return this.vertices.get(id) != undefined;
	}
}