import { invoke } from "@tauri-apps/api/core";
import { APIModel } from "../models/APIModel";

const URL = "https://www.warzone.com/API/GameFeed";
const GAME_ID_PARAM = "GameID";
const EMAIL_PARAM = "Email";
const API_TOKEN_PARAM = "APIToken";
const GET_SETTINGS = "GetSettings";
const GET_HISTORY = "GetHistory";

/**
 * Invokes the Rust function that requests the Warzone API and returns its result
 * @param email The email of the user
 * @param APItoken The API token of the user
 * @param gameID The ID of the game the user wants to request
 * @returns A JSON object with the response of the Warzone API
 */
export async function requestGameFromAPI(email: string, APItoken: string, gameID: number): Promise<APIModel> {
	let map = new Map<string, string>();
	map.set(GAME_ID_PARAM, gameID.toString());
	map.set(EMAIL_PARAM, email);
	map.set(API_TOKEN_PARAM, APItoken);
	map.set(GET_SETTINGS, "true");
	map.set(GET_HISTORY, "true");
	const res = await invoke('get_request_warzone', {
		url: URL, 
		queryParams: map
	}) as string;
	return JSON.parse(res);
}