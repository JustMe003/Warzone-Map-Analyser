import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { DominationSet } from "./DominationSet";

export class ConnectedDominationSet extends DominationSet<AnalysedTerritory> {
    constructor(dominationVertices: AnalysedTerritory[] = [], disruptedVertices: Set<number> = new Set()) {
        super([]);

        const groups: AnalysedTerritory[][] = [];
        dominationVertices.forEach(e => {
            groups.push([e]);
        });

        const dominationVerticesMap = this.arrayToMap(dominationVertices);
        while (groups.length > 1) {
            const vertexArray = groups[0];
            if (vertexArray) {
                let markedSet = new Set<number>();
                let paths: AnalysedTerritory[][] = [];
                vertexArray.forEach(e => {
                    markedSet.add(e.getId());
                    paths.push([e]);
                });
                const finishedPaths: AnalysedTerritory[][] = [];
                while (finishedPaths.length <= 0) {
                    const newPaths: AnalysedTerritory[][] = [];
                    const newMarkedSet = new Set<number>();
                    paths.forEach(arr => {
                        const v = arr[arr.length - 1];
                        v.getEdges().forEach(e => {
                            if (!disruptedVertices.has(e.getId())) {
                                const id = e.getId();
                                if (!markedSet.has(id)) {
                                    newMarkedSet.add(id);
                                    const path = Array.from(arr)
                                    path.push(e);
                                    if (dominationVerticesMap.has(id)) {
                                        finishedPaths.push(path);
                                    } else {
                                        newPaths.push(path);
                                    }
                                }
                            }
                        });
                    });
                    paths = newPaths;
                    newMarkedSet.forEach(id => {
                        markedSet.add(id);
                    });
                    if (paths.length == 0) break;       // No possible path found
                }
                
                if (finishedPaths.length > 0) {
                    // all finished paths are of the same length
                    const chosenPath = finishedPaths[Math.round(Math.random() * (finishedPaths.length - 1))];
                    let group: AnalysedTerritory[] = [];
                    const endId = chosenPath[chosenPath.length - 1].getId();
                    for (let i = 1; i < groups.length; i++) {
                        let vertexInGroup = false;
                        groups[i].forEach(v => {
                            if (v.getId() == endId) {
                                vertexInGroup = true;
                                return;
                            }
                        });
                        if (vertexInGroup) {
                            group = groups[i];
                            break;
                        }
                    }
                    for (let i = 1; i < chosenPath.length - 1; i++) {
                        const v = chosenPath[i];
                        group.push(v);
                        dominationVerticesMap.set(v.getId(), v);
                    }
                    groups.shift()?.forEach(e => {
                        group.push(e);
                    });
                } else {
                    // No possible path was found. This means that the map cannot be connected with the
                    // disrupted vertices. We remove the group and resolve the rest of the groups 
                    // until we are left with 1 group.
                    groups.shift();
                }
            }
        }
        this.setVertices(groups[0]);
    }

    private arrayToMap(array: AnalysedTerritory[]) {
        const map = new Map<number, AnalysedTerritory>();
        array.forEach(v => {
            map.set(v.getId(), v);
        });
        return map;
    }
}