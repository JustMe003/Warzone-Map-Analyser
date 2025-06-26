import { AnalysedTerritory } from "../abstractAnalysers/AnalysedTerritory";
import { GeneralAnalysedBonus } from "./GeneralAnalysedBonus";

export class GeneralAnalysedTerritory extends AnalysedTerritory {
    constructor(id: number, name: string, xCoord: number | undefined, yCoord: number | undefined, edges: GeneralAnalysedTerritory[] = [], bonuses: GeneralAnalysedBonus[] = []) {
        super(id, name, xCoord, yCoord, edges, bonuses)
    }

    public analyse() {
        const set = new Set<number>();
        let minTerrs = Number.MAX_SAFE_INTEGER;
        this.bonuses.forEach(b => {
            set.add(b.getId());
            if (b.getAllVertices().size < minTerrs && b.getIsConnected() && b.getValue() > 0) {
                this.mainBonusId = b.getId();
                minTerrs = b.getAllVertices().size;
            }
            this.approximateValue += b.getValue() / b.getAllVertices().size;
        });

        // If there is only 1 bonus, than that bonus must be its main bonus
        if (this.bonuses.length == 1) {
            this.mainBonusId = this.bonuses[0].getId();
        // If there are 2 or more bonuses and none is yet picked, pick the one with the least amount of vertices
        } else if (this.bonuses.length > 1 && Number.isNaN(this.mainBonusId)) {
            this.bonuses.forEach(b => {
                if (b.getAllVertices().size < minTerrs) {
                    this.mainBonusId = b.getId();
                    minTerrs = b.getAllVertices().size;
                }
            });
        }

        this.edges.forEach(e => {
            e.getBonuses().forEach(b => {
                if (!set.has(b.getId())) this.connectedBonuses.add(b);
            });
        });
        this.isAnalysed = true;
    }
}