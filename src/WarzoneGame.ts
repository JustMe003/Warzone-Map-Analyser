import { requestGameFromAPI } from "./API/requestGame";
import { FileHandler } from "./fileHandler/FileHandler";
import { ValidAPIModel } from "./models/ValidAPIModel";

export async function requestWarzoneGame(email: string, APIToken: string, gameID: number): Promise<ValidAPIModel | string> {
    const res = await requestGameFromAPI(email, APIToken, gameID);
    if (res.error) {
        return res.error;
	} else {
		return res as ValidAPIModel;
	}
}

export async function loadWarzoneGame(fileName: string) {
    return JSON.parse(await FileHandler.getFileContents(fileName)) as ValidAPIModel;
}