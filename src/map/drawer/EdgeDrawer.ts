import { GraphicalEdge } from "../GraphicalEdge";

export interface EdgeElement {
  	x1: number;
	y1: number;
	x2: number;
	y2: number;
	color: string;
};

export interface EdgeDrawerObject {
	lines: GraphicalEdge[];
	xOffset: number;
	yOffset: number;
	ratio: number;
	edgeSize: number;
}