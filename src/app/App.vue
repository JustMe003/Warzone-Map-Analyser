<script setup lang="ts">
import { ref } from "vue";
import MapTemplate from "../map/Map.vue";
import SideBarTemplate from "../sidebar/Sidebar.vue";
import { listen } from "@tauri-apps/api/event";
import { loadWarzoneGame, requestWarzoneGame } from "../WarzoneGame";
import { appData } from "./App";
import { ValidAPIModel } from "../models/ValidAPIModel";
import { Inputs } from "../sidebar/input/Inputs";
import { GamesListAnalyser } from "../analyser/GamesListAnalyser";
import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";


const mapRef = ref(0);        // Used to trigger a redraw of the map
const sidebarRef = ref(0);    // Used to trigger a redraw of the sidebar
const titleRef = ref("Warzone Map Analyser");     // Used to show the title
const subTitleRef = ref("Created by Just_A_Dutchman_");   // Used to show the subtitle

/**
 * Listens for a new request for a Warzone game
 * 
 * If the inputs given result in a valid Warzone game,
 * The app data will be refreshed.
 * 
 * Otherwise it will show an alert showing the error message.
 */
listen("requestWarzoneGame", async e => {
  appData.setDoAnalyseMap(true);
  const payload = e.payload as Inputs;
  const result = await requestWarzoneGame(payload.email, payload.APItoken, payload.gameID);
  if (typeof(result) == "object") {
    updateWarzoneMap(result);
  } else {
    alert(result);
  }
});

/**
 * Listens for a request to load a Warzone game from a file
 */
listen("loadWarzoneGame", async e => {
  updateWarzoneMap(await loadWarzoneGame(e.payload as string));
});

listen("analyseWarzoneGames", async e => {
  appData.setDoAnalyseMap(false);
  const weights = [
    // [2, 2, 1],
    // [2, 1, 2],
    // [1, 2, 2],
    // [2, 1, 1],
    // [1, 2, 1],
    [1, 1, 2],
    [3, 2, 1],
    [3, 1, 2],
    [1, 3, 2],
    [2, 3, 1],
    [2, 1, 3],
    [1, 2, 3],
    [1, 1, 1]
  ];
  for (let i = 0; i < weights.length; i++) {
      console.log("iteration " + (i + 1) + " of " + (weights.length) + "\nWeights: ", weights[i]);
      await new GamesListAnalyser(e.payload as string).analyse(weights[i], [3, 2, 1], async (path) => {
        updateWarzoneMap(await loadWarzoneGame(path));
        return appData.getAnalysedMap() as AnalysedMap;
      });
  }

})

/**
 * Listens for a request to redraw the map
 */
listen("drawMap", _ => {
  updateMap();
});

/**
 * Triggers a redraw of the map
 */
function updateMap() {
  mapRef.value++;
}

/**
 * Triggers a redraw of the sidebar
 */
function updateSidebar() {
  sidebarRef.value++;
}

/**
 * Updates the app data with the new Warzone game model
 * @param model The new Warzone game model
 */
function updateWarzoneMap(model: ValidAPIModel) {
  appData.updateGameData(model);
  updateMap();
  updateSidebar();
  titleRef.value = appData.getMapName();
  subTitleRef.value = appData.getGameName();
  // appData.getAnalysedMap()?.analyse();
}
</script>

<template>
  <div class="root">
    <div class="header">
      <h4>{{ titleRef }}</h4>
      <h5>{{ subTitleRef }}</h5>
    </div>
    <div class="main">
      <MapTemplate :key="mapRef" class="map-template" />
      <SideBarTemplate :key="sidebarRef" class="sidebar-template" />
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<style>

.root {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header, .footer {
  text-align: center;
  background-color: darkgray;
  padding: 1px;
}

.main {
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.map-template {
  float: left;
  width: 85%;
  height: 100%;
}

.sidebar-template {
  float: left;
  width: 15%;
  height: 100%;
}

html, body, #app {
  height: 100%;
  margin: 0px;
}

</style>