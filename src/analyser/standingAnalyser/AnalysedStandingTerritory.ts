import { AnalysedTerritory } from "../abstractAnalysers/AnalysedTerritory";
import { AnalysedStandingBonus } from "./AnalysedStandingBonus";

export class AnalysedStandingTerritory extends AnalysedTerritory {
    private owner: number;
    private armies: number;
    private isWasteland: boolean;

    constructor(id: number, name: string, xCoord: number, yCoord: number, owner: number, armies: number, isWasteland: boolean, edges: AnalysedStandingTerritory[] = [], bonuses: AnalysedStandingBonus[] = []) {
        super(id, name, xCoord, yCoord, edges, bonuses);
        this.owner = owner;
        this.armies = armies;
        this.isWasteland = isWasteland;
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

        if (!this.isWasteland) {
            this.edges.forEach(e => {
                e.getBonuses().forEach(b => {
                    if (!set.has(b.getId())) this.connectedBonuses.add(b);
                });
            });
        }
        this.isAnalysed = true;
    }

    public getOwner() {
        return this.owner;
    }

    public getArmies() {
        return this.armies;
    }

    public getIsWasteland() {
        return this.isWasteland;
    }
}