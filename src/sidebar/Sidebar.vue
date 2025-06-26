<script setup lang="ts">
import Chart from "./chart/Chart.vue";
import SidebarMenu from "./sidebarMenu/SidebarMenu.vue";
import InputTemplate from "./input/Input.vue";

</script>

<template>
	<div class="sidebar">
		<div class="sidebar-elements">
			<InputTemplate />
			<SidebarMenu />
			<Chart />
		</div>
	</div>
</template>

<style>
.sidebar {
	background-color: gray;
	overflow-y: auto;
}

.sidebar-elements {
	color: #ededed;
	padding: 3px;
}

.titleP {
	text-align: center;
}
</style>