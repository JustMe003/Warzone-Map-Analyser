import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";

export class GraphicalEdge {
    private territory1: AnalysedTerritory;
    private territory2: AnalysedTerritory;
    private color: string | null;

    private static DEFAULT_EDGE_COLOR = "white";

    constructor(territory1: AnalysedTerritory, territory2: AnalysedTerritory, color: string | null) {
        this.territory1 = territory1;
        this.territory2 = territory2;
        this.color = color;
    }

    public getFirstTerritory() {
        return this.territory1;
    }

    public getSecondTerritory() {
        return this.territory2;
    }

    public getColor() {
        return this.color || GraphicalEdge.DEFAULT_EDGE_COLOR;
    }

    public setColor(color: string | null) {
        this.color = color;
    }
}