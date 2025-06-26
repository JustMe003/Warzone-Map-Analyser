<script setup lang="ts">
import { ref } from 'vue';
import { EdgeDrawerObject } from './EdgeDrawer';

const props = defineProps<EdgeDrawerObject>();

const lines = ref(props.lines);		// Contains all the data required to draw the edges
</script>

<template>
	<line
		v-for="line in lines"
		:x1="(line.getFirstTerritory().getXCoord() + props.xOffset) * props.ratio"
		:y1="(line.getFirstTerritory().getYCoord() + props.yOffset) * props.ratio"
		:x2="(line.getSecondTerritory().getXCoord() + props.xOffset) * props.ratio"
		:y2="(line.getSecondTerritory().getYCoord() + props.yOffset) * props.ratio"
		:stroke="line.getColor()"
		:stroke-width="props.edgeSize"
	/>
</template>