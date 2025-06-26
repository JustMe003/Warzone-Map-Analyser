import { GraphicalEdge } from "./GraphicalEdge";
import { GraphicalTerritory } from "./GraphicalTerritory";

export class GraphicalMap {
    private territories: Map<number, GraphicalTerritory>;
    private edges: GraphicalEdge[];
    private id: number;
    private xMax: number;
    private yMax: number;
    private xMin: number;
    private yMin: number;
    private verticeSize: number;
    private edgeSize: number;
    private static RATIO: number = 1;

    private showDominationColor: boolean;
    private showMainBonusColor: boolean;
    private showConnectedBonusesColor: boolean;

    constructor(territories: Map<number, GraphicalTerritory> = new Map(), edges: GraphicalEdge[], id: number, xMax: number, yMax: number, xMin: number, yMin: number) {
        this.territories = territories;
        this.edges = edges;
        this.id = id;
        this.xMax = xMax;
        this.yMax = yMax;
        this.xMin = xMin;
        this.yMin = yMin;
        this.verticeSize = 10;
        this.edgeSize = 1;

        this.showDominationColor = true;
        this.showMainBonusColor = true;
        this.showConnectedBonusesColor = true;
    }

    public getTerritories() {
        return this.territories;
    }

    public getTerritory(id: number) {
        return this.territories.get(id);
    }

    public getEdges() {
        return this.edges;
    }

    public getId() {
        return this.id;
    }

    public updateRatio(clientHeight: number, clientWidth: number) {
        GraphicalMap.RATIO = Math.min(clientHeight / (this.yMax - this.yMin), clientWidth / (this.xMax - this.xMin));
    }

    public getClientHeight() {
        return GraphicalMap.RATIO * (this.yMax - this.yMin + 2 * this.verticeSize);
    }

    public getClientWidth() {
        return GraphicalMap.RATIO * (this.xMax - this.xMin + 2 * this.verticeSize);
    }

    public getXOffset() {
        return -this.xMin + this.verticeSize;
    }

    public getYOffset() {
        return -this.yMin + this.verticeSize;
    }

    public getRatio() {
        return GraphicalMap.RATIO;
    }

    public getVerticeSize() {
        return Math.min(this.verticeSize * (GraphicalMap.RATIO * 2), 10);
    }

    public getEdgeSize() {
        return Math.max(Math.min(this.edgeSize * GraphicalMap.RATIO, 2), 0.5);
    }

    private updateTerritoryColors() {
        this.territories.forEach(t => {
            t.setDefaultColor(this.showDominationColor, this.showMainBonusColor, this.showConnectedBonusesColor);
        });
    }

    public updateShowDominationColor() {
        this.showDominationColor = !this.showDominationColor;
        this.updateTerritoryColors();
    }

    public updateShowMainBonusColor() {
        this.showMainBonusColor = !this.showMainBonusColor;
        this.updateTerritoryColors();
    }

    public updateShowConnectedBonusesColor() {
        this.showConnectedBonusesColor = !this.showConnectedBonusesColor;
        this.updateTerritoryColors();
    }
}