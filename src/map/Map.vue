<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EdgeDrawer from './drawer/EdgeDrawer.vue';
import VerticeDrawer from './drawer/VerticeDrawer.vue';
import { GraphicalMap } from './GraphicalMap';
import { appData } from '../app/App';

let heightValue = ref("100%");
let widthValue = ref("100%");

const divRef = ref(null);
const redrawRef = ref(0);

let graphicalMap: GraphicalMap;

/**
 * To use the full window we have available, we have to wait until
 * the window has been mounted. Then we can extract how much room we have
 */
onMounted(() => {
  graphicalMap = appData.getGraphicalMap() as GraphicalMap;
  // Only enter if both the div has been drawn and the graphicalMap is not undefined
  if (divRef.value != null && graphicalMap) {
    const element = divRef.value as HTMLElement;
    graphicalMap.updateRatio(element.clientHeight - 40, element.clientWidth - 40);
    heightValue.value = graphicalMap.getClientHeight().toString();
    widthValue.value = graphicalMap.getClientWidth().toString();
    redrawRef.value += 1;
  }
});
</script>


<template>
  <div ref="divRef" class="map">
		<svg id="WarzoneMap" :height="heightValue" :width="widthValue" >
      <EdgeDrawer :key="redrawRef" :xOffset="graphicalMap?.getXOffset() || 0" :yOffset="graphicalMap?.getYOffset() || 0" :ratio="graphicalMap?.getRatio() || 1" :edgeSize="graphicalMap?.getEdgeSize() || 0.5" :lines="graphicalMap?.getEdges() || []" />
      <VerticeDrawer :key="redrawRef" :xOffset="graphicalMap?.getXOffset() || 0" :yOffset="graphicalMap?.getYOffset() || 0" :ratio="graphicalMap?.getRatio() || 0" :verticeSize="(graphicalMap?.getVerticeSize() || 10) * (graphicalMap?.getRatio() || 1)" :vertices="Array.from((graphicalMap?.getTerritories() || new Map()).values())" />
    </svg>
  </div>
</template>

<style>
.map {
  background-color: black;
  overflow-y: auto;
  overflow-x: auto;
}


</style>