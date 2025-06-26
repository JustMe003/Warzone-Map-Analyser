import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";
import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";
import { GraphicalEdge } from "../map/GraphicalEdge";
import { GraphicalMap } from "../map/GraphicalMap";
import { GraphicalTerritory } from "../map/GraphicalTerritory";

let xMax = 0;
let yMax = 0;
let xMin = 100000;
let yMin = 100000;

export function mapToGraphicalMap(map: AnalysedMap): GraphicalMap {
    xMax = 0;
    yMax = 0;
    xMin = 10000;
    yMin = 10000;
    const territories = new Map<number, GraphicalTerritory>();
    const edges: GraphicalEdge[] = [];
    map.getAllVertices().forEach(v => {
        const terr = territoryToGraphicalTerritory(v);
        updateMaxMinValues(v);
        v.getEdges().forEach(e => {
            const terr2 = territories.get(e.getId());
            if (terr2) {
                const edge = new GraphicalEdge(v, e, null);
                terr.addEdge(edge);
                terr2.addEdge(edge);
                edges.push(edge);
            }
        });
        territories.set(v.getId(), terr);
    });

    return new GraphicalMap(territories, edges, map.getId(), xMax, yMax, xMin, yMin);
}

function territoryToGraphicalTerritory(terr: AnalysedTerritory): GraphicalTerritory {
    return new GraphicalTerritory(terr, null);
}

function updateMaxMinValues(terr: AnalysedTerritory) {
    xMax = Math.max(xMax, terr.getXCoord());
    yMax = Math.max(yMax, terr.getYCoord());
    xMin = Math.min(xMin, terr.getXCoord());
    yMin = Math.min(yMin, terr.getYCoord());
}