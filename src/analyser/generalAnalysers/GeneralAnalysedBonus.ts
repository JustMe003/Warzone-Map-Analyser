import { AnalysedBonus } from "../abstractAnalysers/AnalysedBonus";
import { ScoreWeights } from "../BonusWeights";
import { GeneralAnalysedTerritory } from "./GeneralAnalysedTerritory";

export class GeneralAnalysedBonus extends AnalysedBonus {
    constructor(id: number, value: number, name: string, vertices: Map<number, GeneralAnalysedTerritory> = new Map()) {
        super(id, value, name, vertices);
    }

    public analyse() {
        this.valueRatio = this.value / this.vertices.size;
        this.numBorderTerritories = 0;
        let numInnerEdges = 0;
        this.vertices.forEach(v => {
            let isBorderVertex = false;
            v.getEdges().forEach(e => {
                const id = e.getId();
                if (this.vertexInBonus(id)) {
                    numInnerEdges += 1;
                } else {
                    isBorderVertex = true;
                }
            });
            if (!isBorderVertex) this.numBorderTerritories++;
            v.getConnectedBonuses().forEach(b => {
                this.connectedBonuses.add(b.getId());
            });
            this.isSuperBonus = this.isSuperBonus || v.getMainBonusId() != this.id;
        });

        const numVertices = this.vertices.size;
        if (numVertices <= 2) {
            if (this.isConnected) this.degreeScore = 1;
            else this.degreeScore = 0;
        } else {
            const maxNumEdges = (numVertices * (numVertices - 1) / 2);
            const minNumEdges = numVertices - 1;
            this.degreeScore = Math.sqrt((numInnerEdges / 2 - minNumEdges + 1) / (maxNumEdges - minNumEdges + 1)) || 0;
        }
        this.defensiveScore = (this.vertices.size - this.numBorderTerritories) / this.vertices.size;
    }

    public calculateBonusScore(weights: ScoreWeights, totalWeight: number) {
        this.bonusScore = 
            (((weights[0] || 0) * (this.valueRatio)) + 
            ((weights[1] || 0) * (this.defensiveScore)) +
            ((weights[2] || 0) * (this.degreeScore))) / (totalWeight);
    }
}