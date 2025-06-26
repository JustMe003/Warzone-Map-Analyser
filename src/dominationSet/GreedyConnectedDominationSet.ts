import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";
import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { DominationSet } from "./DominationSet";

interface Path {
    vertices: AnalysedTerritory[];
    dominatedBonuses: Set<number>;
}

export class GreedyConnectedDominationSet extends DominationSet<AnalysedTerritory> {
    constructor(graph: AnalysedMap, includeZeroBonuses: boolean = false) {
        super([]);

        const dominationVertices: Map<number, AnalysedTerritory> = new Map();
        const dominatedSet = new Set<number>();
        const vertices = new Map(graph.getAllVertices());

        if (!includeZeroBonuses) {
            // If a bonus has a value of 0, marked it as dominated since we are not interested in it
            graph.getAllBonuses().forEach(b => {
                if (b.getValue() == 0) dominatedSet.add(b.getId());
            })
        }

        while (graph.getAllBonuses().size > dominatedSet.size) {
            let picks: AnalysedTerritory[] = [];
            let numBonuses = 0;
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

                if (connectedBonuses.size > numBonuses) {
                    picks = [v];
                    numBonuses = connectedBonuses.size;
                } else if (connectedBonuses.size == numBonuses) {
                    picks.push(v);
                } else if (connectedBonuses.size == 0) {
                    // This vertex will not help us find the dominated set
                    vertices.delete(key);
                }
            });

            const newVertex = picks[Math.floor(Math.random() * picks.length)];

            let path: Path;
            if (dominationVertices.size == 0) {
                path = {
                    vertices: [newVertex],
                    dominatedBonuses: new Set<number>()
                }
                newVertex.getBonuses().forEach(b => path.dominatedBonuses.add(b.getId()));
                newVertex.getEdges().forEach(e => {
                    e.getBonuses().forEach(b => path.dominatedBonuses.add(b.getId()));
                });
            }
            else path = GreedyConnectedDominationSet.findPath(newVertex, dominationVertices, dominatedSet);  
            
            path.vertices.forEach(v => {
                dominationVertices.set(v.getId(), v);
                vertices.delete(v.getId());
            });
            path.dominatedBonuses.forEach((_, key) => dominatedSet.add(key));
            
            // dominationVertices.push(newVertex);
            // newVertex.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            // vertices.delete(newVertex.getId());
            // newVertex.getEdges().forEach(e => {
            //     e.getBonuses().forEach(b => dominatedSet.add(b.getId()));
            // });

        }

        // console.log(failSafe, graph.getAllBonuses().size, dominatedSet.size);
        if (graph.getAllBonuses().size != dominatedSet.size) throw new Error("It happened!");

        this.setVertices(Array.from(dominationVertices.values()));
    }

    private static findPath(vertex: AnalysedTerritory, dominationVertices: Map<number, AnalysedTerritory>, dominatedBonuses: Set<number>) {
        const pathInit: Path = {
            vertices: [vertex],
            dominatedBonuses: new Set()
        };
        vertex.getConnectedBonuses().forEach(b => {
            if (!dominatedBonuses.has(b.getId())) pathInit.dominatedBonuses.add(b.getId());
        });
        vertex.getBonuses().forEach(b => {
            if (!dominatedBonuses.has(b.getId())) pathInit.dominatedBonuses.add(b.getId());
        });

        let paths: Path[] = [pathInit];
        const finishedPaths: Path[] = [];
        const markedSet = new Set<number>([vertex.getId()]);
        while (finishedPaths.length == 0) {
            const newPaths: Path[] = [];
            const iterationSet = new Set<number>();
            paths.forEach(p => {
                const lastVertex = p.vertices[p.vertices.length - 1];
                lastVertex.getEdges().forEach(e => {
                    if (!markedSet.has(e.getId())) {
                        const bonusIds = new Set<number>();
                        e.getBonuses().forEach(b => {
                            if (!dominatedBonuses.has(b.getId())) bonusIds.add(b.getId());
                        });
                        e.getConnectedBonuses().forEach(b => {
                            if (!dominatedBonuses.has(b.getId())) bonusIds.add(b.getId());
                        });

                        let hasSameBonuses = true;
                        pathInit.dominatedBonuses.forEach(v => {
                            if (!bonusIds.has(v)) {
                                hasSameBonuses = false;
                                return;
                            }
                        });

                        const newPath = {
                            vertices: p.vertices.slice(),
                            dominatedBonuses: new Set(p.dominatedBonuses)
                        };
                        if (hasSameBonuses) {
                            newPath.vertices = [e];
                        }
                        if (dominationVertices.has(e.getId())) {
                            finishedPaths.push(newPath);
                            return;
                        }
                        e.getBonuses().forEach(b => {
                            if (!dominatedBonuses.has(b.getId())) newPath.dominatedBonuses.add(b.getId());
                        });
                        e.getConnectedBonuses().forEach(b => {
                            if (!dominatedBonuses.has(b.getId())) newPath.dominatedBonuses.add(b.getId());
                        });
                        newPath.vertices.push(e);
                        newPaths.push(newPath);
                        iterationSet.add(e.getId());
                    }
                });
            });
            paths = newPaths;
            iterationSet.forEach(v => markedSet.add(v));
        }

        finishedPaths.sort((a, b) => {
            if (a.vertices.length == b.vertices.length) {
                if (a.dominatedBonuses.size == b.dominatedBonuses.size) return Math.random() - 0.5;
                else return a.dominatedBonuses.size - b.dominatedBonuses.size;
            } else return a.vertices.length - b.vertices.length;
        });
        return finishedPaths[0];
    }
}