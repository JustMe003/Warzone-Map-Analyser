import { GeneralAnalysedBonus } from "./GeneralAnalysedBonus";
import { GeneralAnalysedTerritory } from "./GeneralAnalysedTerritory";
import { ScoreWeights } from "../BonusWeights";
import { bonusClusterAnalysis } from "../../clusterAnalysis/ClusterAnalyser";
import { GreedyConnectedDominationSet } from "../../dominationSet/GreedyConnectedDominationSet";
import { Statistic } from "../Statistic";
import { AnalysedMap } from "../abstractAnalysers/AnalysedMap";

export class GeneralAnalysedMap extends AnalysedMap {
    constructor(id: number, name: string, vertices: Map<number, GeneralAnalysedTerritory>, bonuses: Map<number, GeneralAnalysedBonus>) {
        super(id, name, vertices, bonuses);
    }

    public analyse(bonusWeights: ScoreWeights = [4, 2, 4]) {
        if (this.vertices.size > 500) alert("Note that loading big maps might take a while. The software will probably not be responsive until it has finished analysing the map");
        this.vertices.forEach(v => {
            v.analyse();
        });

        const scoresMap = this.analyseBonuses(bonusWeights);
        
        this.analyseConnectedBonuses(scoresMap);

        this.chartClusters = bonusClusterAnalysis(Array.from(this.bonuses.values()));

        const vertexMap = new Map<number, number>();
        const limit = Math.max(10, Math.min(100000 / (this.vertices.size + this.bonuses.size), 1000));
        for (let i = 0; i < limit; i++) {
            const set = new GreedyConnectedDominationSet(this).getVertices();
            set.forEach(v => {
                const id = v.getId();
                vertexMap.set(id, (vertexMap.get(id) || 0) + 1);
            });
            this.dominationStat.addElement(set.length);
        }
        this.dominationStat.getMean();

        this.vertices.forEach(v => {
            v.setDominationScore((vertexMap.get(v.getId()) || 0) / limit);
        });

        this.isAnalysed = true;
    }

    private analyseBonuses(bonusWeights: ScoreWeights) {
        
        const totalWeight = (bonusWeights[0] || 0) + (bonusWeights[1] || 0) + (bonusWeights[2] || 0);

        const bonusScoreStat = new Statistic();
        const scoresMap: Map<number, number> = new Map();
        this.bonuses.forEach(b => {
            b.analyse();
            b.calculateBonusScore(bonusWeights, totalWeight);
            const score = b.getBonusScore();
            bonusScoreStat.addElement(score);
        });
        
        const minScore = bonusScoreStat.getMin();
        const scoreRange = bonusScoreStat.getRange();
        this.bonuses.forEach(b => {
            const score = (b.getBonusScore() - minScore) / scoreRange;
            b.setBonusScore(score); 
            scoresMap.set(b.getId(), score);
        });
        
        this.vertices.forEach(v => {
            v.setMainBonusScore(scoresMap.get(v.getMainBonusId()) || 0);
        });
        return scoresMap;
    }

    private analyseConnectedBonuses(scoresMap: Map<number, number>) {
        const connectedScoresStat = new Statistic();
        const connectedScoresMap: Map<number, number> = new Map();
        const vertexConnScoreStat = new Statistic();
        const vertexConnScoreMap: Map<number, number> = new Map();
        this.bonuses.forEach(bonus => {
            let total = 0;
            let c = 0;
            const connectedBonuses = bonus.getConnectedBonuses();
            bonus.getAllVertices().forEach(v => {
                let vertexTotal = 0;
                v.getEdges().forEach(e => {
                    e.getBonuses().forEach(b => {
                        const id = b.getId();
                        if (connectedBonuses.has(id)) {
                            vertexTotal += scoresMap.get(id) || 0;
                            c++;
                        }
                    });
                });
                vertexConnScoreMap.set(v.getId(), vertexTotal);
                vertexConnScoreStat.addElement(vertexTotal);
                total += vertexTotal;
            });
            // bonus.getConnectedBonuses().forEach(id => {
            //     total += map.get(id) || 0;
            //     c++;
            // });
            const score = total / c || 0
            connectedScoresMap.set(bonus.getId(), score);
            connectedScoresStat.addElement(score);
        });

        const minScore = connectedScoresStat.getMin();
        const scoreRange = connectedScoresStat.getRange();
        this.bonuses.forEach(b => {
            b.setConnectedBonusesScore(((connectedScoresMap.get(b.getId()) || 0) - minScore) / scoreRange);
        });

        const vertexMinScore = vertexConnScoreStat.getMin();
        const vertexScoreRange = vertexConnScoreStat.getRange();
        this.vertices.forEach(v => {
            v.setConnectedBonusesScore(((vertexConnScoreMap.get(v.getId()) || 0) - vertexMinScore) / vertexScoreRange);
        });
    }
}