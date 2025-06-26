import { AnalysedBonus } from "../analyser/abstractAnalysers/AnalysedBonus";
import { GeneralAnalysedBonus } from "../analyser/generalAnalysers/GeneralAnalysedBonus";
import { GeneralAnalysedMap } from "../analyser/generalAnalysers/GeneralAnalysedMap";
import { GeneralAnalysedTerritory } from "../analyser/generalAnalysers/GeneralAnalysedTerritory";
import { BonusAPIModel } from "../models/BonusAPIModel";
import { TerritoryAPIModel } from "../models/TerritoryAPIModel";
import { ValidAPIModel } from "../models/ValidAPIModel";

export function modelToGeneralMap(model: ValidAPIModel): GeneralAnalysedMap {
	const mapModel = model.map;
	const overriddenBonuses = model.settings?.OverriddenBonuses || [];
	const territories = new Map<number, GeneralAnalysedTerritory>();
	mapModel.territories.forEach(terrModel => {
		const terr = modelToVertex(terrModel);
		territories.set(terr.getId(), terr);
		terrModel.connectedTo.forEach(terrID => {
			const v = territories.get(terrID);
			if (v) {
				v.addEdge(terr);
				terr.addEdge(v);
			}
		});
	});

	const bonuses = new Map<number, AnalysedBonus>();
	mapModel.bonuses.forEach(bonusModel => {
		const bonus = modelToBonus(bonusModel);
		bonuses.set(bonus.getId(), bonus);
		bonusModel.territoryIDs.forEach(terrID => {
			const terr = territories.get(terrID);
			terr?.addBonus(bonus);
			bonus.addVertex(terr as GeneralAnalysedTerritory);
		});
		bonus.updateIsConnected();
	});

	overriddenBonuses.forEach(overriddenBonus => {
		bonuses.get(overriddenBonus.bonusID)?.overrideBonusValue(overriddenBonus.value);
	});

	return new GeneralAnalysedMap(Number(mapModel.id), mapModel.name, territories, bonuses);
}

function modelToVertex(terrModel: TerritoryAPIModel): GeneralAnalysedTerritory {
	const coordsList = terrModel.coords.split(",");
	return new GeneralAnalysedTerritory(Number(terrModel.id), terrModel.name, Number(coordsList[0]), Number(coordsList[1]));
}

function modelToBonus(bonusModel: BonusAPIModel): GeneralAnalysedBonus {
	return new GeneralAnalysedBonus(Number(bonusModel.id), Number(bonusModel.value), bonusModel.name);
}