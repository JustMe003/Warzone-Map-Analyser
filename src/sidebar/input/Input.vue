<script setup lang="ts">
import { emit } from '@tauri-apps/api/event';
import { Ref, ref } from 'vue';
import { FileHandler } from '../../fileHandler/FileHandler';

// TODO: REMOVE THESE INITIALS WHEN DEPLOYING
let email = "";
let APItoken = "";
let gameID = 0;

const inputStateRef = ref(false);				// The state of the input template. False -> load saved game; True -> request game
const gameFilesRef: Ref<string[]> = ref([]);	// Array with the list of saved games
const gameFoldersRef: Ref<string[]> = ref([]);

/**
 * Validates the inputs given by the user before notifying the app
 */
async function validateInput() {
	if (email.length < 1) {
		alert("You must enter an email");
		return;
	}
	if (APItoken.length < 1) {
		alert("You must enter your API token");
		return;
	}
	if (gameID < 1000) {
		alert("You must enter a valid game ID");
		return;	
	}

	emit("requestWarzoneGame", { email: email, APItoken: APItoken, gameID: gameID });
}

/**
 * Updates the state of the template
 */
function updateInputState() {
	inputStateRef.value = !inputStateRef.value;
}

/**
 * Initialises the array with the saved games
 */
async function getBuildInGames() {
	const contents = await FileHandler.getAllFiles();
	contents.forEach(f => {
		if (FileHandler.getIsJSONFile(f)) gameFilesRef.value.push(f);
		else gameFoldersRef.value.push(f);
	});
}
getBuildInGames();


</script>

<template>
	<div class="inputs" v-if="inputStateRef">
		<p class="titleP">Fill in your credentials</p>
		<label>Email</label>
		<br>
		<input v-model="email" type="text" class="email" />
		<br>
		<label>API token</label>
		<!-- <button left-maring="5px"><a href="https://www.warzone.com/wiki/Get_API_Token_API">?</a></button> -->
		<br>
		<input v-model="APItoken" type="password" class="APItoken" />
		<br>
		<label>Game ID</label>
		<br>
		<input v-model="gameID" type="number" class="gameID" />
		<br>
		<input type="checkbox" class="checkbox"/>
		<label class="test">Analyse using domination sets</label>
		<br>
		<button type="submit" class="submit" @click="validateInput">Analyse</button>
		<button type="submit" class="submit" @click="updateInputState">Select game</button>
	</div>
	<div class="inputs" v-else>
		<div v-if="gameFilesRef.length > 0">
			<label>Select a game below</label>
			<div>
				<button v-for="name in gameFilesRef" class="gameButton"
					@click="emit('loadWarzoneGame', name)"
				>{{ name.substring(0, name.length - 5) }}</button>
			</div>
			<br>
		</div>
		<div v-if="gameFoldersRef.length > 0">
			<label>Or select a folder with games</label>
			<div>
				<button v-for="name in gameFoldersRef" class="gameButton"
					@click="emit('analyseWarzoneGames', name)"
				>{{ name }}</button>
			</div>
		</div>
		<button type="submit" class="submit" @click="updateInputState">Query game</button>
	</div>
</template>

<style>

label {
	margin: 1px;
}

input {
	margin: 1px;
	width: 90%;
}

.submit {
	align-self: center;
	border-style: outset;
	border-radius: 10px;
	margin-right: 3px;
	width: 40%;
}

.checkbox {
	display: inline-block;
	width: 20px;
	align-self: stretch;
}

.titleP {
	text-align: center;
}

</style>