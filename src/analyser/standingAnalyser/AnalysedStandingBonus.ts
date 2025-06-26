import { AnalysedBonus } from "../abstractAnalysers/AnalysedBonus";
import { ScoreWeights } from "../BonusWeights";
import { AnalysedStandingTerritory } from "./AnalysedStandingTerritory";

export class AnalysedStandingBonus extends AnalysedBonus {
    
    constructor(id: number, value: number, name: string, vertices: Map<number, AnalysedStandingTerritory> = new Map()) {
        super(id, value, name, vertices);
    }
    
    public analyse() {
        let valueRatio = 0;
        this.numBorderTerritories = 0;
        let numInnerEdges = 0;
        const vertices = this.vertices as Map<number, AnalysedStandingTerritory>;
        vertices.forEach(v => {
            valueRatio -= v.getArmies();
            if (!v.getIsWasteland()) {
                let isBorderVertex = false;
                (v.getEdges() as AnalysedStandingTerritory[]).forEach(e => {
                    if (!e.getIsWasteland()) {
                        if (this.vertexInBonus(e.getId())) {
                            numInnerEdges++;
                        } else {
                            isBorderVertex;
                        }
                    }
                });
                if (!isBorderVertex) this.numBorderTerritories++;
            }

            v.getConnectedBonuses().forEach(b => {
                this.connectedBonuses.add(b.getId());
            });
            this.isSuperBonus = this.isSuperBonus || v.getMainBonusId() != this.id;
        });

        this.valueRatio = valueRatio / vertices.size;

        const numVertices = this.vertices.size;
        if (numVertices <= 2) {
            if (this.isConnected) this.degreeScore = 1;
            else this.degreeScore = 0;
        } else {
            const maxNumEdges = (numVertices * (numVertices - 1) / 2);
            const minNumEdges = numVertices - 1;
            this.degreeScore = Math.sqrt((numInnerEdges / 2 - minNumEdges + 1) / (maxNumEdges - minNumEdges + 1)) || 0;
            // this.degreeScore = (numInnerEdges / 2 - minNumEdges) / (maxNumEdges - minNumEdges)
        }

        /*
        0.9090909090909091 0.6849842909354144 0.2857142857142857
        0.8695652173913044 0.6530753736853312 0.26666666666666666
        0.9655172413793105 0.7755434755004368 0.35294117647058826
        */

        this.defensiveScore = (this.vertices.size - this.numBorderTerritories) / this.vertices.size;
    }
    
    public calculateBonusScore(weights: ScoreWeights, totalWeight: number) {
        this.bonusScore = 
            (((weights[0] || 0) * (this.valueRatio)) + 
            ((weights[1] || 0) * (this.defensiveScore)) +
            ((weights[2] || 0) * (this.degreeScore))) / (totalWeight);
    }
}