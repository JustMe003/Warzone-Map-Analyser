import { Bonus } from "../../graph/Bonus";
import { Territory } from "../../graph/Territory";

export abstract class AnalysedTerritory extends Territory<AnalysedTerritory>{
    protected mainBonusId: number;
    protected approximateValue: number;
    protected connectedBonuses: Set<Bonus<AnalysedTerritory>>;
    protected isAnalysed: boolean;
    protected dominationScore: number;
    protected connectedBonusesScore: number;
    protected mainBonusScore: number;

    constructor(id: number, name: string, xCoord: number | undefined, yCoord: number | undefined, edges: AnalysedTerritory[] = [], bonuses: Bonus<AnalysedTerritory>[] = []) {
        super(id, name, xCoord, yCoord, edges, bonuses)
        this.approximateValue = 0;
        this.connectedBonuses = new Set();
        this.mainBonusId = NaN;
        this.isAnalysed = false;
        this.connectedBonusesScore = NaN;
        this.dominationScore = NaN;
        this.mainBonusScore = NaN;
    }

    public abstract analyse(): void;

    public setConnectedBonusesScore(score: number) {
        this.connectedBonusesScore = score;
    }

    public setMainBonusScore(score: number) {
        this.mainBonusScore = score;
    }

    public setDominationScore(score: number) {
        this.dominationScore = score;
    }

    public getApproximateValue() {
        return this.approximateValue;
    }

    public getMainBonusId() {
        return this.mainBonusId;
    }

    public getConnectedBonuses() {
        return this.connectedBonuses;
    }

    public getHasDoneIndependentAnalysis() {
        return this.isAnalysed;
    }

    public getConnectedBonusesScore() {
        return this.connectedBonusesScore;
    }

    public getDominationScore() {
        return this.dominationScore;
    }

    public getMainBonusScore() {
        return this.mainBonusScore;
    }
}