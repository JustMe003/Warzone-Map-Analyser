<script setup lang="ts">
import { ref } from 'vue';
import { VerticeDrawerObject } from './VerticeDrawer';
import { GraphicalTerritoryMethods } from '../GraphicalTerritory';
import { emit } from '@tauri-apps/api/event';
import { SelectedVertices } from './SelectedVertices';

const props = defineProps<VerticeDrawerObject>();

const vertices = ref(props.vertices);		// Contains all the data required to draw the edges
const tooltipX = ref(0);					// X coordinate for the tooltip
const tooltipY = ref(0);					// Y coordinate for the tooltip
const tooltipText = ref("");				// The text for the tooltip
const tooltipVisibility = ref("hidden");	// Visibility for the tooltop

/**
 * Notifies the app that a vertex has been clicked
 * @param vertex The clicked vertex
 */
function onClick(vertex: GraphicalTerritoryMethods) {
	SelectedVertices.selectVertex(vertex);
	emit("verticeSelected", { id: vertex.getTerritory().getId() });
}

/**
 * Shows the tooltip of the vertex when the user hovers over a vertex
 * @param vertex The vertex being hovered on
 */
function onHoverStart(vertex: GraphicalTerritoryMethods) {
	const terr = vertex.getTerritory();
	tooltipX.value = (terr.getXCoord() + props.xOffset) * props.ratio + props.verticeSize;
	tooltipY.value = (terr.getYCoord() + props.yOffset) * props.ratio + props.verticeSize;
	tooltipText.value = vertex.getTerritory().getName();
	tooltipVisibility.value = "visible";
}

/**
 * Removes the tooltip if the user stops hovering over a vertex
 */
function onHoverEnd() {
	tooltipText.value = "";
	tooltipVisibility.value = "hidden";
}
</script>


<template>
	<circle
		v-for="(vertex) in vertices" @click="onClick(vertex)" @mouseover="onHoverStart(vertex)" @mouseleave="onHoverEnd"
		:cx="(vertex.getTerritory().getXCoord() + props.xOffset) * props.ratio"
		:cy="(vertex.getTerritory().getYCoord() + props.yOffset) * props.ratio"
		:fill="vertex.getColor()"
		:r="props.verticeSize"
		:id="'vertex' + vertex.getTerritory().getId()"
	/>
	<foreignObject :x="tooltipX" :y="tooltipY" :visibility="tooltipVisibility"  id="verticeTooltip">
		<span id="verticeTooltipText">{{ tooltipText }}</span>
	</foreignObject>
</template>

<style>
foreignObject {
	display: block;
	width: 300px;
	overflow: visible;
}

#verticeTooltipText {
	margin: 0px;
	padding: 1px;
	text-align: start;
	color: black;
	background-color: #dddddd;
}

</style>