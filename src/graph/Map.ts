import { Graph } from "./Graph";
import { Bonus } from "./Bonus";
import { Territory } from "./Territory";

export class WarzoneMap<T extends Territory<T>, V extends Bonus<T>> extends Graph<T> {
	protected id: number;
	protected name: string;
	protected bonuses: Map<number, V>;

	constructor(id: number, name: string, vertices: Map<number, T> = new Map(), bonuses: Map<number, V> = new Map()) {
		super(vertices);
		this.id = id;
		this.name = name;
		this.bonuses = bonuses;
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public getAllBonuses() {
		return this.bonuses;
	}

	public getBonus(id: number) {
		const b = this.bonuses.get(id);
		if (b) return b;
		throw new Error("There does not exists a bonus with id " + id.toString());
	}

	public getPositiveBonuses() {
		const map = new Map<number, V>();
		this.bonuses.forEach(b => {
			if (b.getValue() > 0) map.set(b.getId(), b);
		});
		return map;
	}

	public addBonus(b: V) {
		if (this.bonuses.get(b.getId())) {
			throw new Error("There already exists a bonus with id " + b.getId().toString());
		}
		this.bonuses.set(b.getId(), b);
	}

}
