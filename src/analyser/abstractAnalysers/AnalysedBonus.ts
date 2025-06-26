import { Bonus } from "../../graph/Bonus";
import { ScoreWeights } from "../BonusWeights";
import { AnalysedTerritory } from "./AnalysedTerritory";

export abstract class AnalysedBonus extends Bonus<AnalysedTerritory> {
    protected valueRatio: number;     // The bonus value divided by the number of vertices in this bonus
    protected isSuperBonus: boolean;
    protected numBorderTerritories: number;       // Number of vertice in the bonus, that are connected with at least 1 vertex outside the bonus
    protected degreeScore: number;
    protected defensiveScore: number;
    protected connectedBonuses: Set<number>;
    protected bonusScore: number;
    protected connectedBonusesScore: number;
    
    constructor(id: number, value: number, name: string, vertices: Map<number, AnalysedTerritory> = new Map()) {
        super(id, value, name, vertices);
        this.valueRatio = NaN;
        this.isSuperBonus = false;
        this.connectedBonuses = new Set();
        this.numBorderTerritories = NaN;
        this.degreeScore = NaN;
        this.defensiveScore = NaN;
        this.bonusScore = NaN;
        this.connectedBonusesScore = NaN;
    }

    public abstract analyse(): void;

    public abstract calculateBonusScore(weights: ScoreWeights, totalWeight: number): void;

    public setBonusScore(score: number) {
        this.bonusScore = score;
    }

    public setConnectedBonusesScore(score: number) {
        this.connectedBonusesScore = score
    }

    public getNumTerrs() {
        return this.vertices.size;
    }

    public getValueRatio() {
        return this.valueRatio;
    }

    public getIsSuperBonus() {
        return this.isSuperBonus;
    }

    public getDegreeScore() {
        return this.degreeScore;
    }

    public getDefensiveScore() {
        return this.defensiveScore;
    }

    public getNumBorderTerritories() {
        return this.numBorderTerritories;
    }

    public getConnectedBonuses() {
        return this.connectedBonuses;
    }

    public getBonusScore() {
        return this.bonusScore;
    }

    public getConnectedBonusesScore() {
        return this.connectedBonusesScore;
    }
}