import { APIModel } from "./APIModel";
import { TerritoryStandingAPIModel } from "./TerritoryStandingAPIModel";
import { GameSettingsAPIModel } from "./GameSettingsAPIModel";
import { MapAPIModel } from "./MapAPIModel";
import { PlayerAPIModel } from "./PlayerAPIModel";

export interface ValidAPIModel extends APIModel {
	id: string,
	state: string,
	numberOfTurns: string,
	created: string,
	lastTurnTime: string,
	players: PlayerAPIModel[],
	map: MapAPIModel,
	name: string;
	settings: GameSettingsAPIModel;
	distributionStanding: TerritoryStandingAPIModel[] | undefined;
	picks: { [key: string]: number[]};
	standing0: TerritoryStandingAPIModel[] | undefined;
}

