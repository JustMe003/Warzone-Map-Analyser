import { ScatterPoint } from "./ScatterPoint";
import { Cluster } from "./Cluster";
import { ClusterElement } from "./ClusterElement";
import { AnalysedBonus } from "../analyser/abstractAnalysers/AnalysedBonus";
import { AnalysedTerritory } from "../analyser/abstractAnalysers/AnalysedTerritory";

const SAFE_GUARD = 100;
const NUM_CLUSTERS = 4;

/**
 * Performs cluster analysis on an array
 * @param data The array with data
 * @returns A 2-dimensional array, containing 4 clusters of the data
 */
export function bonusClusterAnalysis(data: AnalysedBonus[]) {
    return clusterAnalyser(data, e => { return e.getBonusScore() }, e => { return e.getConnectedBonusesScore() }, e => { return e.getId() });
}

export function picksClusterAnalysis(data: AnalysedTerritory[]) {
    return clusterAnalyser(data, e => {
        return e.getMainBonusScore();
    }, e => {
        return (e.getDominationScore() + e.getConnectedBonusesScore()) / 2;
    }, e => { return e.getId() });
}

function clusterAnalyser<T>(data: T[], getX: (e: T) => number, getY: (e: T) => number, getId: (e: T) => number) {
    // First get the minimum and maximum values
    let xMin = Number.MAX_SAFE_INTEGER;
    let xMax = Number.MIN_SAFE_INTEGER;
    let yMin = Number.MAX_SAFE_INTEGER;
    let yMax = Number.MIN_SAFE_INTEGER;
    data.forEach(e => {
        const x = getX(e);
        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        const y = getY(e);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
    });

    // Create the mid points for the 4 clusters: 1 for each quadrant
    const xQuarter = (xMax - xMin) / 4;
    const yQuarter = (yMax - yMin) / 4;
    const midPoints: ClusterElement[] = [{
        x: xMax - xQuarter,
        y: yMax - yQuarter,
    }, {
        x: xMin + xQuarter,
        y: yMax - yQuarter
    }, {
        x: xMax - xQuarter,
        y: yMin + yQuarter
    }, {
        x: xMin + xQuarter,
        y: yMin + yQuarter
    }];

    let safeGuard = SAFE_GUARD;      // Run at most 100 times
    while (true) {
        // Initialize clusters
        const clusters: Cluster<ScatterPoint>[] = []
        for (let k = 0; k < NUM_CLUSTERS; k++) {
            clusters[k] = new Cluster();
        }

        data.forEach(e => {
            // Get the closest cluster middle point
            let min = Number.MAX_SAFE_INTEGER;
            let index = NaN;
            const element: ScatterPoint = {
                x: getX(e),
                y: getY(e),
                id: getId(e)
            };
            for(let k = 0; k < NUM_CLUSTERS; k++) {
                const dist = Math.pow((midPoints[k].x - element.x), 2) + Math.pow((midPoints[k].y - element.y), 2);
                if (dist < min) {
                    min = dist;
                    index = k;
                }
            }
            clusters[index].add(element);    // Add this element to the cluster with the closest middle point
        });

        // Re-evaluate the middle points of all clusters
        let equalMidpoints = true;
        for(let k = 0; k < NUM_CLUSTERS; k++) {
            const newMidPoint = clusters[k].getMiddle();
            equalMidpoints = equalMidpoints && newMidPoint.x == midPoints[k].x && newMidPoint.y == midPoints[k].y;
            if (!(Number.isNaN(newMidPoint.x) || Number.isNaN(newMidPoint.y))) midPoints[k] = newMidPoint;
        }

        // If the middle points did not change OR the safeguard < 0, return clusters
        if (equalMidpoints || safeGuard < 0) {
            return clusters;
        }
        safeGuard--;
    }
}
