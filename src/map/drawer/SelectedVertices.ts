import { emit } from "@tauri-apps/api/event";
import { GraphicalTerritoryMethods } from "../GraphicalTerritory";

const vertexColor = "blue";
const localEdge = "green";
const outsideEdge = "gold"

export class SelectedVertices {
    private static vertex: GraphicalTerritoryMethods | null = null;
    private static verticeList: GraphicalTerritoryMethods[] = [];

    public static resetSelection() {
        if (this.vertex) {
            this.vertex?.setColor(null);
            this.vertex?.getEdges().forEach(e => {
                e.setColor(null);
            })
            this.vertex = null;
        } else if (this.verticeList.length > 0) {
            this.verticeList.forEach(v => {
                v.setColor(null);
                v.getEdges().forEach(e => {
                    e.setColor(null);
                });
            });
            this.verticeList = [];
        }
    }
    
    public static selectVertex(newTerr: GraphicalTerritoryMethods) {
        this.resetSelection();
        newTerr.getEdges().forEach(e => {
            e.setColor(outsideEdge);
        });
        newTerr.setColor(vertexColor);
        this.vertex = newTerr;
        emit("drawMap");
    }
    
    public static selectVerticeSelection(newTerrs: GraphicalTerritoryMethods[]) {
        this.resetSelection();
        const set = new Set<number>();
        newTerrs.forEach(v => {
            set.add(v.getTerritory().getId());
            v.getEdges().forEach(e => {
                if (set.has(e.getFirstTerritory().getId()) && set.has(e.getSecondTerritory().getId())) e.setColor(localEdge);
                else e.setColor(outsideEdge);
            });
            v.setColor(vertexColor);
        });
        this.verticeList = newTerrs;
        emit("drawMap");
    }
}