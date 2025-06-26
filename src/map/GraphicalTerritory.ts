import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { GraphicalEdge } from "./GraphicalEdge";

export interface GraphicalTerritoryMethods {
	getTerritory: () => AnalysedTerritory;
    getColor: () => string;
    getEdges: () => GraphicalEdge[];
    setColor: (color: string | null) => void;
};

const minColor = 105;
const dynamicColor = 255 - minColor;

export class GraphicalTerritory implements GraphicalTerritoryMethods {
	private territory: AnalysedTerritory;
	private color: string | null;
	private edges: GraphicalEdge[];
	private defaultColor: string;

	constructor(territory: AnalysedTerritory, color: string | null, edges: GraphicalEdge[] = []) {
		this.territory = territory;
		this.color = color;
		this.edges = edges;
		this.defaultColor = "";
		this.setDefaultColor(true, true, true);
	}

	public setDefaultColor(showDominationColor: boolean, showMainBonusColor: boolean, showConnectedBonusesColor: boolean) {
		this.defaultColor = "rgb(" + (minColor + (showDominationColor ? this.territory.getDominationScore() || 0 : 0) * dynamicColor) +
							", " + (minColor + (showMainBonusColor ? this.territory.getMainBonusScore() || 0 : 0) * dynamicColor) + 
							", " + (minColor + (showConnectedBonusesColor ? this.territory.getConnectedBonusesScore() || 0 : 0) * dynamicColor) + ")";
	}

	public getTerritory() {
		return this.territory;
	}

	public getColor() {
		return this.color || this.defaultColor;
	}

	public getEdges() {
		return this.edges;
	}

	public addEdge(edge: GraphicalEdge) {
		this.edges.push(edge);
	}

	public setColor(color: string | null) {
		this.color = color;
	}
}