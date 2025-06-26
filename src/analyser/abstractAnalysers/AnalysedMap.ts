import { WarzoneMap } from "../../graph/Map";
import { Cluster } from "../../clusterAnalysis/Cluster";
import { ScatterPoint } from "../../clusterAnalysis/ScatterPoint";
import { Statistic } from "../Statistic";
import { AnalysedBonus } from "./AnalysedBonus";
import { AnalysedTerritory } from "./AnalysedTerritory";
import { ClusterElement } from "../../clusterAnalysis/ClusterElement";

export abstract class AnalysedMap extends WarzoneMap<AnalysedTerritory, AnalysedBonus> {
    protected isAnalysed: boolean;
    protected chartClusters: Cluster<ScatterPoint>[];
    protected dominationStat: Statistic;

    constructor(id: number, name: string, vertices: Map<number, AnalysedTerritory> = new Map(), bonuses: Map<number, AnalysedBonus> = new Map()) {
        super(id, name, vertices, bonuses);
        this.isAnalysed = false;
        this.chartClusters = [];
        this.dominationStat = new Statistic();
    }

    public abstract analyse(): void;

    public getIsAnalysed() {
        return this.isAnalysed;
    }

    public getBonusList() {
        return Array.from(this.bonuses.values());
    }

    public getChartClusters() {
        return this.chartClusters;
    }

    public getClosestCluster(point: ClusterElement, blacklistedCluster: number[] = []) {
        let index = 0;
        let minDistance = Number.MAX_SAFE_INTEGER;
        this.chartClusters.forEach((c, i) => {
            if (!blacklistedCluster.includes(c.getClusterId())) {
                const distance = c.getDistance(point);
                if (distance < minDistance) {
                    index = i;
                    minDistance = distance;
                }
            }
        });
        return this.chartClusters[index];
    }
}