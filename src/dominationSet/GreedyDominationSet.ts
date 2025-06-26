import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";
import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { DominationSet } from "./DominationSet";

/**
 * GreedyDominationSet class. Finds a domination set by using a greedy approach.
 */
export class GreedyDominationSet extends DominationSet<AnalysedTerritory> {
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
            let picks: AnalysedTerritory[] = [];    // Array with best vertices
            let numBonuses = 0;                     // The number of new bonuses that will be dominated
            vertices.forEach((v, key) => {
                if (!disruptedVertices.has(key)) {
                    const connectedBonuses = new Set<number>();     // The set of new bonus IDs that will be dominated by this vertex
                    v.getBonuses().forEach(b => {
                        if (!dominatedSet.has(b.getId())) connectedBonuses.add(b.getId());
                    });
                    v.getEdges().forEach(e => {
                        e.getBonuses().forEach(b => {
                            if (!dominatedSet.has(b.getId())) connectedBonuses.add(b.getId())
                        });
                    });
    
                    if (connectedBonuses.size > numBonuses) {   // Found a better vertex than so far
                        picks = [v];
                        numBonuses = connectedBonuses.size;
                    } else if (connectedBonuses.size == numBonuses) {
                        picks.push(v);
                    } else if (connectedBonuses.size == 0) {
                        // This vertex will not help us find the dominated set
                        vertices.delete(key);
                    }
                }
            });

            // Pick a random vertex from the array
            const newVertex = picks[Math.floor(Math.random() * picks.length)];
            dominationVertices.push(newVertex);
            newVertex.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            vertices.delete(newVertex.getId());
            newVertex.getEdges().forEach(e => {
                e.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            });
        }

        this.setVertices(dominationVertices);
    }
}