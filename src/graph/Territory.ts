import { Vertex } from "./Vertice";
import { Bonus } from "./Bonus";

export class Territory<T extends Territory<T>> extends Vertex<T> {
	protected bonuses: Bonus<T>[]

	constructor(id: number, name: string, xCoord: number = 0, yCoord: number = 0, edges: T[] = [], bonuses: Bonus<T>[] = []) {
		super(id, name, xCoord, yCoord, edges);
		this.bonuses = bonuses;
	}

	public getBonuses() {
		return this.bonuses;
	}

	public getBonus(id: number): Bonus<T> | undefined {
		let bonus = undefined;
		this.bonuses.forEach(b => {
			if (b.getId() == id) {
				bonus = b;
				return;
			}
		});
		return bonus;
	}

	public addBonus(b: Bonus<T>) {
		this.bonuses.push(b);
	}
}