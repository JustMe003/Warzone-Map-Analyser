import { picksClusterAnalysis } from "../../clusterAnalysis/ClusterAnalyser";
import { ConnectedDominationSet } from "../../dominationSet/ConnectedDominationSet";
import { GreedyDominationSet } from "../../dominationSet/GreedyDominationSet";
import { GreedyWeightedDominationSet } from "../../dominationSet/GreedyWeightedDominationSet";
import { AVAILABLE_FOR_DISTRIBUTION_PLAYER } from "../../util/Players";
import { AnalysedMap } from "../abstractAnalysers/AnalysedMap";
import { ScoreWeights } from "../BonusWeights";
import { PrecisionRecallMetric } from "../PrecisionRecallMetric";
import { Statistic } from "../Statistic";
import { AnalysedStandingBonus } from "./AnalysedStandingBonus";
import { AnalysedStandingTerritory } from "./AnalysedStandingTerritory";

const DISTRIBUTION_TURN_NUMBER = -1;

export class AnalysedStandingMap extends AnalysedMap {
    private turn: number;
    private isDistributionTurn: boolean;
    private pickRanking: AnalysedStandingTerritory[];
    private winnersPicksMetric: PrecisionRecallMetric;
    private otherPicksMetric: PrecisionRecallMetric;
    private allPicksMetric: PrecisionRecallMetric;

    constructor(id: number, name: string, isDistributionTurn: boolean, turn: number, vertices: Map<number, AnalysedStandingTerritory> = new Map(), bonuses: Map<number, AnalysedStandingBonus> = new Map()) {
        super(id, name, vertices, bonuses);
        this.isDistributionTurn = isDistributionTurn;
        this.pickRanking = [];
        if (isDistributionTurn) {
            this.turn = DISTRIBUTION_TURN_NUMBER;
        } else {
            this.turn = turn;
        }

        this.winnersPicksMetric = new PrecisionRecallMetric();
        this.otherPicksMetric = new PrecisionRecallMetric();
        this.allPicksMetric = new PrecisionRecallMetric();  
    }

    public analyse(bonusWeights: ScoreWeights = [4, 2, 4], pickWeights: ScoreWeights = [3, 2, 1]) {
        if (this.vertices.size > 500) alert("Note that loading big maps might take a while. The software will probably not be responsive until it has finished analysing the map");
        this.vertices.forEach(v => {
            v.analyse();
        });

        const scoresMap = this.analyseBonuses(bonusWeights);

        this.analyseConnectedBonuses(scoresMap);
        
        const possiblePicks: AnalysedStandingTerritory[] = [];
        const wastelands = new Set<number>();
        const vertices = this.vertices as Map<number, AnalysedStandingTerritory>;
        vertices.forEach(v => {
            if (v.getIsWasteland()) wastelands.add(v.getId());
            if (v.getOwner() == AVAILABLE_FOR_DISTRIBUTION_PLAYER) possiblePicks.push(v);
        });
        
        const vertexMap = new Map<number, number>();
        const limit = Math.max(10, Math.min(100000 / (this.vertices.size + this.bonuses.size), 1000));
        for (let i = 0; i < limit; i++) {
            const set = new ConnectedDominationSet(new GreedyWeightedDominationSet(this, wastelands).getVertices(), wastelands).getVertices();
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
        
        this.chartClusters = picksClusterAnalysis(possiblePicks);
        
        const firstCluster = this.getClosestCluster({x: 1, y: 1});
        firstCluster.getElements().forEach(p => {
            this.pickRanking.push(vertices.get(p.id) as AnalysedStandingTerritory);
        });

        this.getClosestCluster({x: 1, y: 0}, [firstCluster.getClusterId()]).getElements().forEach(p => {
            this.pickRanking.push(vertices.get(p.id) as AnalysedStandingTerritory);
        });
        
        this.pickRanking.sort((a, b) => {
            return ((pickWeights[0] || 0) * b.getMainBonusScore() + (pickWeights[1] || 0) * b.getConnectedBonusesScore() + (pickWeights[2] || 0) * b.getDominationScore()) 
            - ((pickWeights[0] || 0) * a.getMainBonusScore() + (pickWeights[1] || 0) * a.getConnectedBonusesScore() + (pickWeights[2] || 0) * a.getDominationScore())
        });

        const answerSet: number[] = [];
        this.pickRanking.forEach(pick => {
            answerSet.push(pick.getId());
        })
        this.winnersPicksMetric.setAnswerSet(answerSet);
        this.otherPicksMetric.setAnswerSet(answerSet);
        this.allPicksMetric.setAnswerSet(answerSet);

        this.isAnalysed = true;
    }

    public setPicksMetric(winnerPicks: number[][], otherPicks: number[][]) {
        const winnerSet = new Set<number>();
        winnerPicks.forEach(picks => {
            picks.forEach(pick => {
                winnerSet.add(pick);
            });
        });
        this.winnersPicksMetric.setRelevantSet(Array.from(winnerSet));
        
        const allPicks = new Set<number>();
        otherPicks.forEach(picks => {
            picks.forEach(pick => {
                allPicks.add(pick);
            });
        });
        this.otherPicksMetric.setRelevantSet(Array.from(allPicks));

        winnerPicks.forEach(picks => {
            picks.forEach(pick => {
                allPicks.add(pick);
            })
        });
        this.allPicksMetric.setRelevantSet(Array.from(allPicks));

        // console.log(this.pickRanking, winnerPicks, otherPicks);
    }

    public getTurn() {
        return this.turn;
    }

    public getIsDistributionTurn() {
        return this.isDistributionTurn;
    }

    private analyseBonuses(bonusWeights: ScoreWeights) {
        const totalWeight = (bonusWeights[0] || 0) + (bonusWeights[1] || 0) + (bonusWeights[2] || 0);

        const bonusScoreStat = new Statistic();
        const scoresMap: Map<number, number> = new Map();
        this.bonuses.forEach(b => {
            b.analyse();
            b.calculateBonusScore(bonusWeights, totalWeight);
            bonusScoreStat.addElement(b.getBonusScore());
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

    public getPickRanking() {
        return this.pickRanking;
    }

    public getWinnersPicksMetric() {
        return this.winnersPicksMetric;
    }

    public getOtherPicksMetric() {
        return this.otherPicksMetric;
    }

    public getAllPicksMetric() {
        return this.allPicksMetric;
    }
}