<script setup lang="ts">
import { emit, listen } from '@tauri-apps/api/event';
import { SidebarMenuPayload } from './SidebarMenu';
import { Ref, ref } from 'vue';
import { SelectedVertices } from '../../map/drawer/SelectedVertices';
import { GraphicalTerritory } from '../../map/GraphicalTerritory';
import { appData } from '../../app/App';
import { AnalysedBonus } from '../../analyser/abstractAnalysers/AnalysedBonus';
import { AnalysedTerritory } from '../../analyser/abstractAnalysers/AnalysedTerritory';
import { AnalysedStandingMap } from '../../analyser/standingAnalyser/AnalysedStandingMap';

const terrRef: Ref<AnalysedTerritory | undefined> = ref(undefined);
const bonusRef: Ref<AnalysedBonus | undefined> = ref(undefined);

const showDominationColor = ref(true);
const showMainBonusColor = ref(true);
const showConnectedBonusesColor = ref(true);

const precision = Math.pow(10, 3);

listen("verticeSelected", (e => {
    const id = (e.payload as SidebarMenuPayload).id;
    if (typeof id == "number") {
        updateSelectedVertices(id);
    }
}));

listen("scatterElementSelected", (e => {
    const id = (e.payload as SidebarMenuPayload).id;
    const map = appData.getAnalysedMap();
    if (typeof id == "number" && map != undefined) {
        if (map instanceof AnalysedStandingMap) selectNewVertex(id);
        else selectNewBonus(id);
    }
}));

function updateSelectedVertices(id: number) {
    terrRef.value = appData.getAnalysedMap()?.getVertex(id);
}

function selectNewVertex(id: number) {
    const map = appData.getGraphicalMap();
    if (map) {
        SelectedVertices.selectVertex(map.getTerritory(id) as GraphicalTerritory);
        updateSelectedVertices(id);
        bonusRef.value = undefined;
    }
}

function highlightBonus(id: number) {
    const graphicalMap = appData.getGraphicalMap();
    const analysedMap = appData.getAnalysedMap();
    if (graphicalMap && analysedMap) {
        const analysedBonus = analysedMap.getBonus(id) as AnalysedBonus;
        const array: GraphicalTerritory[] = [];
        analysedBonus.getAllVertices().forEach(v => {
            array.push(graphicalMap.getTerritory(v.getId()) as GraphicalTerritory);
        });
        SelectedVertices.selectVerticeSelection(array);
    }
}

function selectNewBonus(id: number) {
    const graphicalMap = appData.getGraphicalMap();
    const analysedMap = appData.getAnalysedMap();
    if (graphicalMap && analysedMap) {
        terrRef.value = undefined;
        bonusRef.value = analysedMap.getBonus(id) as AnalysedBonus;
        highlightBonus(id);
    }
}

function updateVerticesColor() {
    console.log(showDominationColor.value);
    console.log(showMainBonusColor.value);
    console.log(showConnectedBonusesColor.value);
}

function triggerMapRefresh() {
    emit("drawMap");
}

</script>

<template>
    <div class="verticesColorCheckboxes" v-if="appData.getGraphicalMap() != undefined">
        <div class="checkboxesDiv">
            <input type="checkbox" class="checkbox" name="dominationColor" :checked="showDominationColor" @click="appData.getGraphicalMap()?.updateShowDominationColor" v-model="showDominationColor">
            <label class="labels" for="dominationScore">Domination score</label>
        </div>
        
        <div class="checkboxesDiv">
            <input type="checkbox" class="checkbox" name="mainBonusColor" :checked="showMainBonusColor" @click="appData.getGraphicalMap()?.updateShowMainBonusColor" v-model="showMainBonusColor">
            <label class="labels" for="mainBonusColor">Main bonus score</label>
        </div>
        
        <div class="checkboxesDiv">
            <input type="checkbox" class="checkbox" name="connectedBonusColor" :checked="showConnectedBonusesColor" @click="appData.getGraphicalMap()?.updateShowConnectedBonusesColor" v-model="showConnectedBonusesColor">
            <label class="labels" for="connectedBonusColor">Connected bonuses score</label>
        </div>
        <button @click="triggerMapRefresh">Update map</button>
    </div>
    <div v-if="terrRef != undefined" class="sidebarMenuParagraph">
        <h5>{{ terrRef?.getName() }}</h5>
        <p v-if="terrRef.getMainBonusId()">Main bonus: {{ terrRef.getBonus(terrRef.getMainBonusId())?.getName() || "N.A." }}</p>
        <p>Main bonus score: {{ Math.round(terrRef.getMainBonusScore() * precision) / precision }}</p>
        <p>Connected Bonuses score: {{ Math.round(terrRef.getConnectedBonusesScore() * precision) / precision }}</p>
        <p>Domination score: {{ Math.round(terrRef.getDominationScore() * precision) / precision }}</p>
        <p>Connections:</p>
        <button v-for="(edge) in (terrRef?.getEdges() || [])"
            @click="selectNewVertex(edge.getId())"
        >{{ edge.getName() }}</button>
        <p>Bonuses:</p>
        <button v-for="(bonus) in terrRef?.getBonuses()"
            @click="selectNewBonus(bonus.getId())"
        >{{ bonus.getName() + " (" + bonus.getValue() + ")" }}</button>
    </div>
    <div v-else-if="bonusRef != undefined" class="sidebarMenuParagraph">
        <h5>{{ bonusRef.getName() }}</h5>
        <p>Value: {{ bonusRef.getValue() }}</p>
        <p>Is super bonus: {{ bonusRef.getIsSuperBonus() }}</p>
        <p>Value ratio: {{ Math.round(bonusRef.getValueRatio() * precision) / precision }}</p>
        <p>Degree score: {{ Math.round(bonusRef.getDegreeScore() * precision) / precision }}</p>
        <p>Num border territories: {{ bonusRef.getNumBorderTerritories() }}</p>
        <p>Bonus score: {{ Math.round(bonusRef.getBonusScore() * precision) / precision }}</p>
        <p>Connected bonuses score: {{ Math.round(bonusRef.getConnectedBonusesScore() * precision) / precision }}</p>
        <p>Territories ({{ bonusRef.getAllVertices().size }}):</p>
        <button v-for="(terr) in bonusRef.getAllVertices().values()"
            @click="selectNewVertex(terr.getId())"
        >{{ terr.getName() }}</button>
    </div>
    <div v-else>
        <p>No territory or bonus selected</p>
    </div>
</template>

<style>
p {
    margin: 3px 0px;
}

h5 {
    margin: 3px 0px;
    text-align: center;
}

.checkbox {
    width: 10px;
    margin: 0px;
    float: left;
}

.labels {
    float: left;
    margin-left: 3px;
}

.checkboxesDiv {
  display: flex;
  justify-content: left;
  width: 90%;
  margin: 0.5rem;
}
</style>