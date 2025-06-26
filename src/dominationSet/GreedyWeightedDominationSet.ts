import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";
import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { DominationSet } from "./DominationSet";

/**
 * WeightedElement interface
 */
interface WeightedElement<T> {
    value: T,
    minBound: number,
    maxBound: number
}

/**
 * GreedyWeightedDominationSet class. Finds a domination set by using a greedy approach and a weighted selection process
 */
export class GreedyWeightedDominationSet extends DominationSet<AnalysedTerritory> {
    constructor(graph: AnalysedMap, disruptedVertices: Set<number> = new Set(), includeZeroBonuses: boolean = false) {
        super([]);

        const dominationVertices: AnalysedTerritory[] = [];     // The vertices in this domination set
        const dominatedSet = new Set<number>();                 // The set of bonusIDs that are already dominated 
        const vertices = new Map(graph.getAllVertices());       // All vertices in the graph
        
        if (!includeZeroBonuses) {
            // If a bonus has a value of 0, marked it as dominated since we are not interested in dominating it
            graph.getAllBonuses().forEach(b => {
                if (b.getValue() == 0) dominatedSet.add(b.getId());
            });
        }

        if (disruptedVertices.size > 0) {
            disruptedVertices.forEach(id => {
                vertices.get(id)?.getBonuses().forEach(b => {
                    dominatedSet.add(b.getId());
                })
            });
        }

        // Run until we have dominated all bonuses
        while (graph.getAllBonuses().size > dominatedSet.size) {
            const picks: WeightedElement<AnalysedTerritory>[] = [];
            let totalWeight = 0;
            
            vertices.forEach((v, key) => {
                const connectedBonuses = new Set<number>();
                v.getBonuses().forEach(b => {
                    if (!dominatedSet.has(b.getId())) connectedBonuses.add(b.getId());
                });
                v.getEdges().forEach(e => {
                    e.getBonuses().forEach(b => {
                        if (!dominatedSet.has(b.getId())) connectedBonuses.add(b.getId())
                    });
                });

                if (connectedBonuses.size == 0) {
                    vertices.delete(key);
                } else {
                    const vertexWeight = Math.pow(10, connectedBonuses.size - 1);
                    picks.push({
                        value: v,
                        minBound: totalWeight,
                        maxBound: totalWeight + vertexWeight - 1
                    });
                    totalWeight += vertexWeight;
                }
            });

            const randVertex = this.getVertexFromWeightedList(picks, Math.floor(Math.random() * totalWeight));
            dominationVertices.push(randVertex);
            randVertex.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            vertices.delete(randVertex.getId());
            randVertex.getEdges().forEach(e => {
                e.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            });
        }
        this.setVertices(dominationVertices);
    }

    private getVertexFromWeightedList<T>(list: WeightedElement<T>[], weight: number, leftIndex: number = NaN, rightIndex: number = NaN): T {
        if (Number.isNaN(leftIndex) && Number.isNaN(rightIndex)) {
            leftIndex = 0;
            rightIndex = list.length - 1;
        } else if (leftIndex == rightIndex) {
            return list[leftIndex].value;
        }

        const midIndex = Math.round(leftIndex + ((rightIndex - leftIndex) / 2));
        const midElement = list[midIndex];
        if (midElement.minBound <= weight && midElement.maxBound >= weight) {
            return midElement.value;
        } else if(midElement.minBound > weight) {
            return this.getVertexFromWeightedList(list, weight, leftIndex, midIndex - 1);
        } else {
            return this.getVertexFromWeightedList(list, weight, midIndex + 1, rightIndex);
        }
    }
}